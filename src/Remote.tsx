import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Home, RotateCcw, Tv } from 'lucide-react';
import './Remote.css';

type RemoteCommand = 'up' | 'down' | 'left' | 'right' | 'select' | 'back' | 'home';

// Get WebSocket URL based on environment
const getWebSocketUrl = (): string => {
  if (import.meta.env.PROD) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }
  return `ws://${window.location.hostname}:3001`;
};

function Remote() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') setIsConnected(true);
      } catch (e) {}
    };
    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          window.location.reload();
        }
      }, 3000);
    };
    ws.onerror = () => setIsConnected(false);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sendCommand = useCallback((command: RemoteCommand) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'command', command }));
      setActiveBtn(command);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setActiveBtn(null), 150);
    }
  }, []);

  return (
    <div className="remote-app">
      {/* Ambient Background */}
      <div className="remote-bg">
        <div className="bg-gradient bg-1" />
        <div className="bg-gradient bg-2" />
      </div>

      <div className="remote-wrapper">
        {/* Header */}
        <header className="remote-header">
          <div className="logo-section">
            <Tv className="logo-icon" />
            <span>Cambodia TV</span>
          </div>
          <div className={`status-pill ${isConnected ? 'online' : ''}`}>
            <span className="status-dot" />
            {isConnected ? 'Connected' : 'Offline'}
          </div>
        </header>

        {/* Remote Body */}
        <div className="remote-body">
          {/* Touchpad / D-Pad Area */}
          <div className="touchpad">
            <button
              className={`nav-btn nav-up ${activeBtn === 'up' ? 'active' : ''}`}
              onClick={() => sendCommand('up')}
            >
              <ChevronUp strokeWidth={2.5} />
            </button>
            <button
              className={`nav-btn nav-left ${activeBtn === 'left' ? 'active' : ''}`}
              onClick={() => sendCommand('left')}
            >
              <ChevronLeft strokeWidth={2.5} />
            </button>
            <button
              className={`nav-btn nav-center ${activeBtn === 'select' ? 'active' : ''}`}
              onClick={() => sendCommand('select')}
            >
              <span>OK</span>
            </button>
            <button
              className={`nav-btn nav-right ${activeBtn === 'right' ? 'active' : ''}`}
              onClick={() => sendCommand('right')}
            >
              <ChevronRight strokeWidth={2.5} />
            </button>
            <button
              className={`nav-btn nav-down ${activeBtn === 'down' ? 'active' : ''}`}
              onClick={() => sendCommand('down')}
            >
              <ChevronDown strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="bottom-controls">
            <button
              className={`ctrl-btn ${activeBtn === 'back' ? 'active' : ''}`}
              onClick={() => sendCommand('back')}
            >
              <RotateCcw size={20} />
              <span>Back</span>
            </button>
            <button
              className={`ctrl-btn ${activeBtn === 'home' ? 'active' : ''}`}
              onClick={() => sendCommand('home')}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="remote-footer">
          <p>Use this remote to control your TV</p>
        </footer>
      </div>
    </div>
  );
}

export default Remote;
