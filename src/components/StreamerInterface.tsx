import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Filter, 
  Eye, 
  Timer,
  Gift,
  Settings,
  Users,
  Heart,
  Pin,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StreamerInterfaceProps {
  onEndStream: () => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isViewer: boolean;
}

const StreamerInterface = ({ onEndStream }: StreamerInterfaceProps) => {
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const [beautyFilter, setBeautyFilter] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [newFollowers, setNewFollowers] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "MusicLover99",
      message: "Great stream! Love your voice! 🎤",
      timestamp: new Date(),
      isViewer: true,
    },
    {
      id: "2",
      username: "StreamFan42",
      message: "Can you sing my favorite song?",
      timestamp: new Date(),
      isViewer: true,
    },
  ]);

  const categories = ["Music", "Gaming", "Chat", "Art", "Cooking", "Dance", "Tech"];

  const handleGoLive = () => {
    if (streamTitle.trim()) {
      setIsLive(true);
      setViewerCount(1);
      // Start timers and counters
      startStreamTimers();
    }
  };

  const startStreamTimers = () => {
    // Simulate viewer growth
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);

    // Stream duration timer
    const durationInterval = setInterval(() => {
      setStreamDuration(prev => prev + 1);
    }, 1000);

    // Simulate earnings
    const earningsInterval = setInterval(() => {
      setCoinsEarned(prev => prev + Math.floor(Math.random() * 50));
    }, 5000);

    // Simulate new followers
    const followersInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNewFollowers(prev => prev + 1);
      }
    }, 8000);

    // Store intervals for cleanup
    (window as any).streamIntervals = {
      viewerInterval,
      durationInterval,
      earningsInterval,
      followersInterval,
    };
  };

  const handleEndStream = () => {
    setShowEndConfirm(false);
    setIsLive(false);
    
    // Clear intervals
    if ((window as any).streamIntervals) {
      Object.values((window as any).streamIntervals).forEach((interval: any) => {
        clearInterval(interval);
      });
    }
    
    // Show summary and then navigate back
    setTimeout(() => {
      onEndStream();
    }, 3000);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate incoming chat
  useEffect(() => {
    if (!isLive) return;

    const chatInterval = setInterval(() => {
      const randomMessages = [
        "Amazing stream! 🔥",
        "You're so talented! ⭐",
        "Love this! ❤️",
        "More please! 🎵",
        "Best streamer ever! 👑",
        "This is so good! 😍",
        "Keep it up! 💪",
      ];
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: `Viewer${Math.floor(Math.random() * 1000)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        isViewer: true,
      };
      
      setChatMessages(prev => [...prev.slice(-15), newMessage]);
    }, 4000);

    return () => clearInterval(chatInterval);
  }, [isLive]);

  if (!isLive) {
    // Pre-Live Setup Screen
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button variant="ghost" size="icon" onClick={onEndStream}>
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-gradient-primary">Go Live</h1>
          <div className="w-10" />
        </div>

        {/* Camera Preview */}
        <div className="flex-1 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center relative">
          <div className="text-8xl">🎥</div>
          
          {/* Camera Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant={frontCamera ? "default" : "outline"}
              size="icon"
              onClick={() => setFrontCamera(!frontCamera)}
              className="rounded-full"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              variant={beautyFilter ? "default" : "outline"}
              size="icon"
              onClick={() => setBeautyFilter(!beautyFilter)}
              className="rounded-full"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Setup Form */}
        <div className="p-6 space-y-4 bg-card">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Stream Title</label>
            <Input
              placeholder="What's your stream about?"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="h-12 bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleGoLive}
              disabled={!streamTitle.trim()}
              variant="live"
              size="lg"
              className="flex-1"
            >
              🔴 Go Live Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Live Streaming Interface
  return (
    <div className="min-h-screen bg-background relative">
      {/* Live Video Area */}
      <div className="relative h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
        {/* Video Preview */}
        <motion.div
          className="w-full h-full flex items-center justify-center text-8xl"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎤
        </motion.div>

        {/* Top HUD */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className="live-indicator">
              🔴 LIVE
            </Badge>
            <div className="flex items-center gap-2 text-white">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-bold">{formatDuration(streamDuration)}</span>
            </div>
            <div className="viewer-count">
              <Eye className="w-4 h-4 mr-1" />
              {viewerCount.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isMuted ? "destructive" : "ghost"}
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEndConfirm(true)}
              className="w-10 h-10 rounded-full bg-red-500/80 text-white hover:bg-red-500"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="absolute top-20 left-4 bg-black/60 rounded-xl p-3 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4 text-center text-white text-sm">
            <div>
              <div className="font-bold text-lg text-yellow-400">{coinsEarned}</div>
              <div className="text-xs">Coins Earned</div>
            </div>
            <div>
              <div className="font-bold text-lg text-green-400">{newFollowers}</div>
              <div className="text-xs">New Followers</div>
            </div>
            <div>
              <div className="font-bold text-lg text-blue-400">{chatMessages.length}</div>
              <div className="text-xs">Messages</div>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="absolute left-4 bottom-32 right-24 max-h-48 overflow-hidden">
          <div className="space-y-1">
            {chatMessages.slice(-6).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="chat-message max-w-xs group cursor-pointer hover:bg-white/20"
              >
                <span className="font-bold text-sm text-blue-400">
                  {msg.username}:
                </span>
                <span className="ml-2 text-white">{msg.message}</span>
                
                {/* Moderation Options */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 inline-flex gap-1">
                  <button className="text-xs text-yellow-400 hover:text-yellow-300">
                    <Pin className="w-3 h-3" />
                  </button>
                  <button className="text-xs text-red-400 hover:text-red-300">
                    <Shield className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gift Notifications */}
        <div className="absolute right-4 top-32 space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-gift rounded-xl p-3 text-white text-center max-w-32"
          >
            <Gift className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-bold">Gift Received!</div>
            <div className="text-xs">+50 coins</div>
          </motion.div>
        </div>

        {/* Camera Controls */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFrontCamera(!frontCamera)}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBeautyFilter(!beautyFilter)}
            className={`w-12 h-12 rounded-full text-white hover:bg-white/30 ${
              beautyFilter ? 'bg-primary' : 'bg-white/20'
            }`}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* End Stream Confirmation */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">End Live Stream?</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to end your stream? Your viewers will be notified.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleEndStream}
                  className="flex-1"
                >
                  End Stream
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamerInterface;