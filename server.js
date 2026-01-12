import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Proxy endpoint for HLS streams
  if (url.pathname === '/proxy') {
    handleProxy(req, res, url);
    return;
  }

  // Serve static files in production
  if (!isDev) {
    serveStatic(req, res, url);
    return;
  }

  // In dev mode, just return info
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Cambodia TV Server - Dev Mode\nUse Vite for frontend.');
});

// Serve static files from dist folder
function serveStatic(req, res, url) {
  let filePath = path.join(__dirname, 'dist', url.pathname);

  // Default to index.html for SPA routing
  if (url.pathname === '/' || !path.extname(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback - serve index.html for client-side routing
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content2);
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Handle proxy requests for HLS streams
function handleProxy(req, res, url) {
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing url parameter');
    return;
  }

  let target;
  try {
    target = new URL(targetUrl);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid URL');
    return;
  }

  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Only HTTP/HTTPS URLs allowed');
    return;
  }

  const protocol = target.protocol === 'https:' ? https : http;
  const options = {
    hostname: target.hostname,
    port: target.port || (target.protocol === 'https:' ? 443 : 80),
    path: target.pathname + target.search,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': '*/*',
      'Referer': target.origin,
    },
    timeout: 15000,
  };

  if (req.headers.range) {
    options.headers['Range'] = req.headers.range;
  }

  const proxyReq = protocol.request(options, (proxyRes) => {
    let contentType = proxyRes.headers['content-type'] || 'application/octet-stream';
    if (targetUrl.endsWith('.m3u8')) {
      contentType = 'application/vnd.apple.mpegurl';
    } else if (targetUrl.endsWith('.ts')) {
      contentType = 'video/mp2t';
    }

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    };

    if (proxyRes.headers['content-length']) {
      headers['Content-Length'] = proxyRes.headers['content-length'];
    }

    res.writeHead(proxyRes.statusCode, headers);

    if (targetUrl.endsWith('.m3u8')) {
      let body = '';
      proxyRes.setEncoding('utf8');
      proxyRes.on('data', (chunk) => body += chunk);
      proxyRes.on('end', () => {
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        const rewritten = body.split('\n').map(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            let absoluteUrl;
            if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
              absoluteUrl = trimmed;
            } else {
              absoluteUrl = baseUrl + trimmed;
            }
            return `/proxy?url=${encodeURIComponent(absoluteUrl)}`;
          }
          return line;
        }).join('\n');
        res.end(rewritten);
      });
    } else {
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
    }
    res.end(`Proxy error: ${err.message}`);
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.writeHead(504, { 'Content-Type': 'text/plain' });
    }
    res.end('Proxy timeout');
  });

  proxyReq.end();
}

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);
});

// WebSocket server for remote control
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Remote connected. Total:', wss.clients.size);
  ws.send(JSON.stringify({ type: 'connected' }));

  ws.on('message', (message) => {
    const data = message.toString();
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('Remote disconnected. Total:', wss.clients.size);
  });
});

console.log('WebSocket server attached to HTTP server');
