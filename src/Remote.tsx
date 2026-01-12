import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Volume2, VolumeX, Home } from 'lucide-react';
import './Remote.css';

type RemoteCommand = 'up' | 'down' | 'left' | 'right' | 'select' | 'back' | 'home' | 'mute' | 'volume_up' | 'volume_down';

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
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const wsUrl = getWebSocketUrl();
    console.log('Connecting to WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') {
          setIsConnected(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Try to reconnect after 2 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          window.location.reload();
        }
      }, 2000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  const sendCommand = useCallback((command: RemoteCommand) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'command', command }));
      setLastCommand(command);

      // Vibrate feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Clear last command display after 500ms
      setTimeout(() => setLastCommand(null), 500);
    }
  }, []);

  return (
    <div className="remote-container">
      <div className="remote-device">
        <div className="remote-header">
          <h1>Cambodia TV</h1>
          <span className={`connection-status ${isConnected ? 'connected' : ''}`}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>

        <p className="remote-note">
          Control your TV from this device
        </p>

        {/* D-Pad */}
        <div className="dpad-container">
          <button
            className="dpad-btn dpad-up"
            onClick={() => sendCommand('up')}
            aria-label="Up"
          >
            <ArrowUp size={28} />
          </button>
          <button
            className="dpad-btn dpad-left"
            onClick={() => sendCommand('left')}
            aria-label="Left"
          >
            <ArrowLeft size={28} />
          </button>
          <button
            className="dpad-btn dpad-center"
            onClick={() => sendCommand('select')}
            aria-label="Select"
          >
            OK
          </button>
          <button
            className="dpad-btn dpad-right"
            onClick={() => sendCommand('right')}
            aria-label="Right"
          >
            <ArrowRight size={28} />
          </button>
          <button
            className="dpad-btn dpad-down"
            onClick={() => sendCommand('down')}
            aria-label="Down"
          >
            <ArrowDown size={28} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="action-btn back-btn"
            onClick={() => sendCommand('back')}
          >
            Back
          </button>
          <button
            className="action-btn home-btn"
            onClick={() => sendCommand('home')}
          >
            <Home size={20} />
            Home
          </button>
        </div>

        {/* Volume & Play Controls */}
        <div className="media-controls">
          <button
            className="media-btn"
            onClick={() => sendCommand('volume_down')}
            aria-label="Volume Down"
          >
            <VolumeX size={22} />
          </button>
          <button
            className="media-btn play-btn"
            onClick={() => sendCommand('select')}
            aria-label="Play/Pause"
          >
            <Play size={24} />
          </button>
          <button
            className="media-btn"
            onClick={() => sendCommand('volume_up')}
            aria-label="Volume Up"
          >
            <Volume2 size={22} />
          </button>
        </div>

        {/* Last Command Feedback */}
        {lastCommand && (
          <div className="command-feedback">
            {lastCommand.replace('_', ' ').toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Remote;
