export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const target = new URL(targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': target.origin,
      },
    });

    const contentType = targetUrl.endsWith('.m3u8')
      ? 'application/vnd.apple.mpegurl'
      : targetUrl.endsWith('.ts')
      ? 'video/mp2t'
      : response.headers.get('content-type') || 'application/octet-stream';

    // For m3u8 files, rewrite URLs to use proxy
    if (targetUrl.endsWith('.m3u8')) {
      const body = await response.text();
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
          return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
        }
        return line;
      }).join('\n');

      return new Response(rewritten, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // For other files, stream directly
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 502 });
  }
}
