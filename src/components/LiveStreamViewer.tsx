import { useState, useEffect, useRef } from "react";
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
  Flag,
  Smile,
  ChevronDown,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ViewerListModal, { Viewer } from "@/components/ViewerListModal";
import { toast } from "@/components/ui/use-toast";
import { useModeration } from "@/hooks/useModeration";

interface LiveStreamViewerProps {
  streamId: string;
  onBack: () => void;
  onGiftPanel: () => void;
  giftAnimation?: string | null;
  coinBalance?: number;
  onCoinDeduct?: (amount: number) => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
  isModerator?: boolean;
  isPinned?: boolean;
  isGiftMessage?: boolean;
  giftEmoji?: string;
}

interface GiftData {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  animation: string;
}

interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: 'sparkle' | 'confetti' | 'star';
}

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

const LiveStreamViewer = ({ 
  streamId, 
  onBack, 
  onGiftPanel, 
  giftAnimation: externalGiftAnimation, 
  coinBalance = 1250,
  onCoinDeduct 
}: LiveStreamViewerProps) => {
  const [message, setMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(1247);
  const [viewerCount, setViewerCount] = useState(24123);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [giftAnimation, setGiftAnimation] = useState<string | null>(null);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentGift, setCurrentGift] = useState<GiftData | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isViewerListOpen, setIsViewerListOpen] = useState(false);
  const [viewers] = useState<Viewer[]>([
    { id: "u1", name: "User123", avatarUrl: "https://i.pravatar.cc/100?img=1", totalCoins: 120 },
    { id: "u2", name: "Luna", avatarUrl: "https://i.pravatar.cc/100?img=2", totalCoins: 540 },
    { id: "u3", name: "NovaStar", avatarUrl: "https://i.pravatar.cc/100?img=3", totalCoins: 15 },
    { id: "u4", name: "BeatRider", avatarUrl: "https://i.pravatar.cc/100?img=4", totalCoins: 0 },
    { id: "u5", name: "Melody", avatarUrl: "https://i.pravatar.cc/100?img=5", totalCoins: 1000 },
  ]);
  const [bannedUntil, setBannedUntil] = useState<number | null>(null);
  const [foulStrikes, setFoulStrikes] = useState(0);
  const { check } = useModeration();

  // Emoji list for chat
  const emojis = ["😀", "😂", "❤️", "👍", "🔥", "😍", "🎉", "👏", "😎", "🌟", "💎", "🎵", "🎤", "🎶", "🌹", "💕"];

  // Gift sound effects
  const playGiftSound = (giftType: string) => {
    // In a real app, you'd have actual audio files
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore audio play errors
      });
    }
  };

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
    const now = Date.now();
    if (bannedUntil && now < bannedUntil) {
      toast({ title: "You're temporarily muted", description: "Please wait before sending more messages.", variant: "destructive" });
      return;
    }

    const trimmed = message.trim();
    if (!trimmed) return;

    const mod = check(trimmed);
    if (mod.flagged) {
      const next = foulStrikes + 1;
      setFoulStrikes(next);
      if (next >= 2) {
        const muteFor = 10 * 60 * 1000; // 10 minutes
        setBannedUntil(now + muteFor);
        toast({ title: "Chat banned for 10 minutes", description: "Repeated abusive content detected.", variant: "destructive" });
        setMessage("");
        return;
      }
      toast({ title: "Inappropriate language", description: mod.reason || "Please be respectful. Further attempts will result in a 10-minute ban.", variant: "destructive" });
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You",
      message: trimmed,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    setMessage("");
    
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

  const handleGiftReceived = (giftData: GiftData) => {
    setCurrentGift(giftData);
    setGiftAnimation(giftData.animation);
    
    // Play sound effect
    playGiftSound(giftData.animation);
    
    // Create particle effects
    createParticleEffects(giftData.animation);
    
    // Add gift message to chat
    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "System",
      message: `sent a ${giftData.name}!`,
      timestamp: new Date(),
      isGiftMessage: true,
      giftEmoji: giftData.emoji,
    };
    setChatMessages(prev => [...prev, giftMessage]);
    
    // Clear animation after duration
    setTimeout(() => {
      setGiftAnimation(null);
      setCurrentGift(null);
    }, 3000);
  };

  const createParticleEffects = (giftType: string) => {
    const particleCount = giftType === 'royal' || giftType === 'explode' ? 12 : 6;
    const newParticles: ParticleEffect[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: giftType === 'royal' ? 'star' : giftType === 'explode' ? 'confetti' : 'sparkle'
      });
    }
    
    setParticleEffects(prev => [...prev, ...newParticles]);
    
    // Clear particles after animation
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2000);
  };

  // Update gift animation when external prop changes
  useEffect(() => {
    if (!externalGiftAnimation) return;
    const mockGift: GiftData = {
      id: 'external',
      name: 'Gift',
      emoji: '🎁',
      cost: 0,
      animation: externalGiftAnimation
    };
    handleGiftReceived(mockGift);
  }, [externalGiftAnimation]);

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
      
      setChatMessages(prev => [...prev, newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Prune chat messages older than 2 minutes
  useEffect(() => {
    const prune = setInterval(() => {
      setChatMessages(prev => prev.filter(m => Date.now() - m.timestamp.getTime() < 2 * 60 * 1000));
    }, 10000);
    return () => clearInterval(prune);
  }, []);

  // Report functionality
  const handleReport = () => {
    setShowReportModal(true);
  };

  const submitReport = (reason: string) => {
    // In a real app, this would send to backend
    toast({
      title: "Report Submitted",
      description: "Thank you for reporting. We'll review this stream.",
    });
    setShowReportModal(false);
  };

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
                    <button
                      type="button"
                      onClick={() => setIsViewerListOpen(true)}
                      className="viewer-count cursor-pointer hover:opacity-90 transition-opacity"
                      aria-label="Viewers list"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {viewerCount.toLocaleString()}
                    </button>
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
        <div className="absolute left-4 bottom-32 right-24 max-h-64">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto scrollbar-hide"
          >
            <div className="space-y-1">
              {chatMessages
                .filter((m) => !m.isPinned)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message max-w-xs ${msg.isGiftMessage ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg' : ''}`}
                  >
                    {msg.isGiftMessage ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{msg.giftEmoji}</span>
                        <div>
                          <span className="font-bold text-sm text-yellow-400">Gift Alert!</span>
                          <span className="ml-2 text-white">{msg.username} {msg.message}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className={`font-bold text-sm ${msg.isStreamer ? 'text-yellow-400' : msg.isModerator ? 'text-green-400' : 'text-blue-400'}`}>
                          {msg.username}:
                        </span>
                        <span className="ml-2 text-white">{msg.message}</span>
                      </>
                    )}
                  </div>
                ))}
            </div>
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

        {/* Particle Effects */}
        <AnimatePresence>
          {particleEffects.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                opacity: 1, 
                scale: 0,
                x: `${particle.x}%`,
                y: `${particle.y}%`
              }}
              animate={{ 
                opacity: 0, 
                scale: 1,
                y: `${particle.y - 50}%`,
                rotate: 360
              }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-xl pointer-events-none"
            >
              {particle.type === 'sparkle' ? '✨' : particle.type === 'confetti' ? '🎊' : '⭐'}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Gift Animations */}
        <AnimatePresence>
          {giftAnimation && currentGift && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="text-center">
                {(giftAnimation === 'float') && (
                  <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.8 }}
                    animate={{ 
                      y: [-20, -40, -60], 
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 1.2, 1.0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="text-8xl mb-4"
                  >
                    {currentGift.emoji}
                  </motion.div>
                )}
                
                {(giftAnimation === 'explode') && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.5, 1], 
                        rotate: [0, 180, 360] 
                      }}
                      transition={{ duration: 1.5 }}
                      className="text-8xl mb-4"
                    >
                      {currentGift.emoji}
                    </motion.div>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          scale: [0, 1, 0.5], 
                          x: (Math.cos(i * 30 * Math.PI / 180) * 300),
                          y: (Math.sin(i * 30 * Math.PI / 180) * 300),
                          opacity: [1, 1, 0],
                          rotate: 720
                        }}
                        transition={{ duration: 2.5, delay: 0.5 }}
                        className="absolute text-3xl"
                      >
                        {i % 3 === 0 ? '✨' : i % 3 === 1 ? '🎊' : '⭐'}
                      </motion.div>
                    ))}
                  </>
                )}
                
                {(giftAnimation === 'royal') && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 0.8, repeat: 3 }}
                      className="text-9xl mb-4"
                    >
                      {currentGift.emoji}
                    </motion.div>
                    <motion.div 
                      className="text-yellow-400 text-5xl font-black mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      ROYAL GIFT!
                    </motion.div>
                    <motion.div 
                      className="w-64 h-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                )}
                
                {/* Enhanced default animations */}
                {!['float', 'explode', 'royal'].includes(giftAnimation || '') && giftAnimation && (
                  <>
                    <motion.div
                      className="text-8xl mb-4"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ 
                        scale: [0, 1.3, 1], 
                        rotate: [0, 360],
                        y: [0, -20, 0]
                      }}
                      transition={{ duration: 1.5, ease: "backOut" }}
                    >
                      {currentGift.emoji}
                    </motion.div>
                    {/* Sparkle burst */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{ 
                          scale: 1, 
                          x: (Math.cos(i * 60 * Math.PI / 180) * 150),
                          y: (Math.sin(i * 60 * Math.PI / 180) * 150),
                          opacity: 0
                        }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="absolute text-2xl"
                      >
                        ✨
                      </motion.div>
                    ))}
                  </>
                )}
                
                <motion.div
                  className="mt-4"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-3xl font-black text-white bg-black/60 px-6 py-3 rounded-full backdrop-blur-sm">
                    {currentGift.name} Received!
                  </p>
                  <p className="text-lg text-yellow-400 mt-2 font-bold">
                    Worth {currentGift.cost} coins!
                  </p>
                </motion.div>
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
            onClick={handleReport}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            <Flag className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Input */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2">
            <div className="flex-1 flex bg-chat-background rounded-full backdrop-blur-sm border border-white/20 relative">
              <Input
                placeholder="Send a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="border-0 bg-transparent text-white placeholder:text-white/60 rounded-full pr-20"
              />
              
              {/* Emoji Picker */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full right-0 mb-2 bg-card/90 backdrop-blur-sm rounded-2xl p-3 border border-border"
                  >
                    <div className="grid grid-cols-8 gap-1 max-w-64">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setMessage(prev => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="text-xl hover:bg-muted rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
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

        {/* Report Modal */}
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-4 border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <h3 className="text-lg font-bold text-foreground">Report Stream</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Why are you reporting this stream?
              </p>
              
              <div className="space-y-2 mb-6">
                {[
                  "Inappropriate content",
                  "Harassment or bullying",
                  "Spam or scam",
                  "Violence or dangerous behavior",
                  "Copyright violation",
                  "Other"
                ].map((reason) => (
                  <Button
                    key={reason}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => submitReport(reason)}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowReportModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Hidden Audio Element for Gift Sounds */}
        <audio ref={audioRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D" type="audio/wav" />
        </audio>

        {/* Audio for gift sounds - will be silent in demo */}
        <audio ref={audioRef} muted />
      </div>
      <ViewerListModal isOpen={isViewerListOpen} onClose={() => setIsViewerListOpen(false)} viewers={viewers} />
    </div>
  );
};

export default LiveStreamViewer;