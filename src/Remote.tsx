import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Home, RotateCcw, Tv } from 'lucide-react';
import { channels } from './channels';
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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const channelListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') setIsConnected(true);
        // Sync focused index from TV
        if (data.type === 'sync' && typeof data.focusedIndex === 'number') {
          setFocusedIndex(data.focusedIndex);
        }
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

  // Scroll to focused channel
  useEffect(() => {
    if (channelListRef.current) {
      const focusedEl = channelListRef.current.children[focusedIndex] as HTMLElement;
      if (focusedEl) {
        focusedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedIndex]);

  const sendCommand = useCallback((command: RemoteCommand) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'command', command }));
      setActiveBtn(command);
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => setActiveBtn(null), 150);

      // Update local focused index for immediate feedback
      if (command === 'up') {
        setFocusedIndex(prev => Math.max(0, prev - 1));
      } else if (command === 'down') {
        setFocusedIndex(prev => Math.min(channels.length - 1, prev + 1));
      }
    }
  }, []);

  const selectChannel = useCallback((index: number) => {
    setFocusedIndex(index);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Send navigation to reach that channel, then select
      wsRef.current.send(JSON.stringify({ type: 'navigate', index }));
      wsRef.current.send(JSON.stringify({ type: 'command', command: 'select' }));
      if (navigator.vibrate) navigator.vibrate(50);
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

        {/* Channel Grid */}
        <div className="channel-grid" ref={channelListRef}>
          {channels.map((channel, index) => (
            <div
              key={channel.id}
              className={`channel-logo ${index === focusedIndex ? 'focused' : ''}`}
              onClick={() => selectChannel(index)}
            >
              <img
                src={channel.logo}
                alt={channel.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23222" width="40" height="40" rx="6"/><text x="20" y="24" text-anchor="middle" fill="%23555" font-size="8">TV</text></svg>';
                }}
              />
            </div>
          ))}
        </div>

        {/* Remote Controls */}
        <div className="remote-body">
          {/* D-Pad */}
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
              <RotateCcw size={18} />
              <span>Back</span>
            </button>
            <button
              className={`ctrl-btn ${activeBtn === 'home' ? 'active' : ''}`}
              onClick={() => sendCommand('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Remote;
