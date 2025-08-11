import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Heart, 
  Gift, 
  Share2, 
  Eye, 
  MoreVertical,
  Send,
  Pin,
  UserPlus,
  Flag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveStreamViewerProps {
  streamId: string;
  onBack: () => void;
  onGiftPanel: () => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
  isModerator?: boolean;
  isPinned?: boolean;
}

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

const LiveStreamViewer = ({ streamId, onBack, onGiftPanel }: LiveStreamViewerProps) => {
  const [message, setMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(1247);
  const [viewerCount, setViewerCount] = useState(24123);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [giftAnimation, setGiftAnimation] = useState<string | null>(null);

  // Mock stream data
  const streamData = {
    streamer: "Alice_Sunshine",
    title: "Late Night Singing Session 🎤",
    category: "Music",
    isLive: true,
  };

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "MusicLover99",
      message: "Amazing voice! 😍",
      timestamp: new Date(),
    },
    {
      id: "2",
      username: "Alice_Sunshine",
      message: "Thank you so much everyone! 💕",
      timestamp: new Date(),
      isStreamer: true,
    },
    {
      id: "3",
      username: "StreamMod",
      message: "Welcome everyone! Be kind and enjoy the show 🎵",
      timestamp: new Date(),
      isModerator: true,
      isPinned: true,
    },
    {
      id: "4",
      username: "FanGirl22",
      message: "Can you sing my favorite song?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: "You",
        message: message.trim(),
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    
    // Create floating heart
    const heartId = Date.now().toString();
    const newHeart: FloatingHeart = {
      id: heartId,
      x: Math.random() * 100,
      y: 100,
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Remove heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, 3000);
  };

  const handleGift = (giftType: string) => {
    setGiftAnimation(giftType);
    setTimeout(() => setGiftAnimation(null), 2000);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Simulate new chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        "This is so good! 🔥",
        "Love this song! ❤️",
        "You're amazing!",
        "More songs please! 🎵",
        "Best stream ever! ⭐",
      ];
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: `User${Math.floor(Math.random() * 1000)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev.slice(-20), newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Live Video Area */}
      <div className="relative h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
        {/* Background Video Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10">
          <motion.div
            className="w-full h-full flex items-center justify-center text-8xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎤
          </motion.div>
        </div>

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-overlay-dark to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-sm">👩‍🎤</span>
                </div>
                <div>
                  <h2 className="text-white font-bold">{streamData.streamer}</h2>
                  <div className="flex items-center gap-2">
                    <Badge className="live-indicator text-xs">LIVE</Badge>
                    <div className="viewer-count">
                      <Eye className="w-3 h-3 mr-1" />
                      {viewerCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? "secondary" : "follow"}
                size="sm"
                onClick={handleFollow}
                className="text-white"
              >
                {isFollowing ? "Following" : <><UserPlus className="w-4 h-4 mr-1" />Follow</>}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pinned Message */}
        {chatMessages.find(msg => msg.isPinned) && (
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <Pin className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <span className="text-yellow-400 font-bold text-sm">
                    {chatMessages.find(msg => msg.isPinned)?.username}:
                  </span>
                  <span className="text-white ml-2">
                    {chatMessages.find(msg => msg.isPinned)?.message}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="absolute left-4 bottom-32 right-24 max-h-64 overflow-hidden">
          <div className="space-y-1">
            {chatMessages.slice(-8).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`chat-message max-w-xs ${msg.isPinned ? 'hidden' : ''}`}
              >
                <span className={`font-bold text-sm ${
                  msg.isStreamer ? 'text-yellow-400' : 
                  msg.isModerator ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {msg.username}:
                </span>
                <span className="ml-2 text-white">{msg.message}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Hearts */}
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ 
                opacity: 1, 
                y: window.innerHeight - 200,
                x: `${heart.x}%`,
                scale: 0.8
              }}
              animate={{ 
                opacity: 0, 
                y: -100,
                scale: 1.2,
                rotate: 360
              }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute text-red-500 text-2xl pointer-events-none"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Gift Animations */}
        <AnimatePresence>
          {giftAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  {giftAnimation === 'rose' ? '🌹' : 
                   giftAnimation === 'fireworks' ? '🎆' : '👑'}
                </motion.div>
                <motion.p
                  className="text-2xl font-black text-white bg-black/50 px-4 py-2 rounded-full"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  Gift Received!
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side Controls */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-4">
          {/* Like Button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Heart className="w-6 h-6 fill-red-500 text-red-500" />
            </Button>
            <span className="text-white text-xs mt-1 font-bold">{likeCount}</span>
          </motion.div>

          {/* Gift Button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onGiftPanel}
              className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Gift className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1">Gifts</span>
          </motion.div>

          {/* Report Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            <Flag className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Input */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2">
            <div className="flex-1 flex bg-chat-background rounded-full backdrop-blur-sm border border-white/20">
              <Input
                placeholder="Send a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="border-0 bg-transparent text-white placeholder:text-white/60 rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamViewer;