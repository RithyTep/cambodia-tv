import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { QRCodeSVG } from 'qrcode.react';
import { Play, X, Volume2, VolumeX, Maximize, Minimize, Tv, Search, Loader2, AlertCircle, Smartphone, PictureInPicture2 } from 'lucide-react';
import { channels, type Channel } from './channels';
import './App.css';

// Get proxied URL for streams - proxy ALL external streams in production to avoid CORS
const getStreamUrl = (url: string): string => {
  // In production, proxy ALL external streams to avoid CORS issues
  if (import.meta.env.PROD) {
    return `${window.location.origin}/proxy?url=${encodeURIComponent(url)}`;
  }

  // In development, only proxy HTTP streams when on HTTPS page
  const isHttpsPage = window.location.protocol === 'https:';
  const isHttpStream = url.startsWith('http://');
  if (isHttpsPage && isHttpStream) {
    return `http://${window.location.hostname}:3000/proxy?url=${encodeURIComponent(url)}`;
  }

  return url;
};

// Get WebSocket URL based on environment
const getWebSocketUrl = (): string => {
  if (import.meta.env.PROD) {
    // Production: WebSocket on same host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }
  // Development: WebSocket on port 3001
  return `ws://${window.location.hostname}:3001`;
};

// QR Remote Modal Component
function QRRemoteModal({ onClose, remoteUrl }: { onClose: () => void; remoteUrl: string }) {
  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <h2>Remote Control</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="qr-content">
          <QRCodeSVG
            value={remoteUrl}
            size={200}
            bgColor="#1a1a2e"
            fgColor="#ffffff"
            level="M"
          />
          <p className="qr-instruction">Scan with your phone to control TV</p>
          <div className="qr-url">{remoteUrl}</div>
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const rawStreamUrl = channel.streams[currentStreamIndex];
    if (!rawStreamUrl) return;

    // Use proxy for HTTP streams when on HTTPS
    const streamUrl = getStreamUrl(rawStreamUrl);
    console.log('Loading stream:', rawStreamUrl, '→', streamUrl);

    let isMounted = true;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isMounted) {
          setIsLoading(false);
          video.play().catch(() => {});
          setIsPlaying(true);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal && isMounted) {
          // Auto-try next stream if available
          if (currentStreamIndex < channel.streams.length - 1) {
            console.log('Stream failed, trying next...');
            setCurrentStreamIndex(prev => prev + 1);
          } else {
            setError('Stream unavailable. Try another stream or channel.');
            setIsLoading(false);
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      const handleMetadata = () => {
        if (isMounted) {
          setIsLoading(false);
          video.play().catch(() => {});
          setIsPlaying(true);
        }
      };
      video.addEventListener('loadedmetadata', handleMetadata);
      return () => {
        video.removeEventListener('loadedmetadata', handleMetadata);
        isMounted = false;
      };
    }

    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.streams, currentStreamIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const tryNextStream = () => {
    if (currentStreamIndex < channel.streams.length - 1) {
      setCurrentStreamIndex(currentStreamIndex + 1);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  };

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => resetControlsTimeout();
    const handleMouseLeave = () => {
      if (isPlaying) setShowControls(false);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="video-overlay" onClick={onClose}>
      <div className="video-container" ref={containerRef} onClick={(e) => e.stopPropagation()}>
        <div className={`video-header ${showControls ? 'visible' : 'hidden'}`}>
          <div className="channel-info">
            <img src={channel.logo} alt={channel.name} className="channel-logo-small" />
            <div>
              <h2>{channel.name}</h2>
              <span className="channel-desc">{channel.description}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="video-wrapper">
          {isLoading && (
            <div className="video-loading">
              <Loader2 className="spinner" size={48} />
              <span>Loading stream...</span>
            </div>
          )}

          {error && (
            <div className="video-error">
              <AlertCircle size={48} />
              <span>{error}</span>
              {channel.streams.length > 1 && currentStreamIndex < channel.streams.length - 1 && (
                <button onClick={tryNextStream} className="try-next-btn">
                  Try Next Stream
                </button>
              )}
            </div>
          )}

          <video
            ref={videoRef}
            className="video-player"
            playsInline
            onClick={togglePlay}
          />
        </div>

        <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
          <button onClick={togglePlay} className="control-btn">
            {isPlaying ? <span className="pause-icon">❚❚</span> : <Play size={20} />}
          </button>
          <button onClick={toggleMute} className="control-btn">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="stream-info">
            LIVE
            {channel.streams.length > 1 && (
              <span className="stream-count">Stream {currentStreamIndex + 1}/{channel.streams.length}</span>
            )}
          </div>
          <button onClick={togglePiP} className="control-btn" title="Picture in Picture">
            <PictureInPicture2 size={20} />
          </button>
          <button onClick={toggleFullscreen} className="control-btn">
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel, onSelect, isSelected }: {
  channel: Channel;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={`channel-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="card-logo">
        <img
          src={channel.logo}
          alt={channel.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23222" width="100" height="100" rx="8"/><text x="50" y="58" text-anchor="middle" fill="%23666" font-size="14" font-family="system-ui">TV</text></svg>';
          }}
        />
      </div>
      <span className="card-name">{channel.name}</span>
    </div>
  );
}

function App() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showQRRemote, setShowQRRemote] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

  // Remote URL for QR code
  const remoteUrl = `${window.location.origin}/remote`;

  // Get actual number of columns from the CSS grid
  const getGridColumns = () => {
    const grid = document.querySelector('.channels-grid');
    if (!grid) return 4;
    const gridStyle = window.getComputedStyle(grid);
    const columns = gridStyle.gridTemplateColumns.split(' ').length;
    return columns;
  };

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (channel.description && channel.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedChannel) return;

      const cols = getGridColumns();

      switch (e.key) {
        case 'ArrowRight':
          setFocusedIndex(prev => Math.min(prev + 1, filteredChannels.length - 1));
          break;
        case 'ArrowLeft':
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'ArrowDown':
          setFocusedIndex(prev => Math.min(prev + cols, filteredChannels.length - 1));
          break;
        case 'ArrowUp':
          setFocusedIndex(prev => Math.max(prev - cols, 0));
          break;
        case 'Enter':
          if (filteredChannels[focusedIndex]) {
            setSelectedChannel(filteredChannels[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredChannels, focusedIndex, selectedChannel]);

  // WebSocket for remote control
  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected to remote server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'command') {
          const cols = getGridColumns();

          switch (data.command) {
            case 'up':
              setFocusedIndex(prev => Math.max(prev - cols, 0));
              break;
            case 'down':
              setFocusedIndex(prev => Math.min(prev + cols, filteredChannels.length - 1));
              break;
            case 'left':
              setFocusedIndex(prev => Math.max(prev - 1, 0));
              break;
            case 'right':
              setFocusedIndex(prev => Math.min(prev + 1, filteredChannels.length - 1));
              break;
            case 'select':
              if (!selectedChannel && filteredChannels[focusedIndex]) {
                setSelectedChannel(filteredChannels[focusedIndex]);
              }
              break;
            case 'back':
            case 'home':
              setSelectedChannel(null);
              break;
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [filteredChannels, focusedIndex, selectedChannel]);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="tv-launcher">
      {/* Background */}
      <div className="tv-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      {/* Header */}
      <header className="tv-header">
        <div className="header-left">
          <div className="logo">
            <Tv size={32} />
            <span className="logo-text">Cambodia TV</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <button className="qr-btn" onClick={() => setShowQRRemote(true)} title="Remote Control">
            <Smartphone size={22} />
          </button>
          <div className="time-display">
            <span className="time">{currentTime}</span>
            <span className="date">{currentDate}</span>
          </div>
        </div>
      </header>


      {/* Channels Grid */}
      <main className="channels-container">
        <div className="channels-grid">
          {filteredChannels.map((channel, index) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isSelected={index === focusedIndex}
              onSelect={() => setSelectedChannel(channel)}
            />
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="no-channels">
            <Tv size={48} />
            <p>No channels found</p>
          </div>
        )}
      </main>


      {/* Video Player Modal */}
      {selectedChannel && (
        <VideoPlayer
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}

      {/* QR Remote Modal */}
      {showQRRemote && (
        <QRRemoteModal
          remoteUrl={remoteUrl}
          onClose={() => setShowQRRemote(false)}
        />
      )}

    </div>
  );
}

export default App;
