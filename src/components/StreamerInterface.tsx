import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
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
  Shield,
  Video,
  VideoOff,
  Crown,
  ChevronDown,
  Smile,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ViewerListModal, { Viewer } from "@/components/ViewerListModal";
import EmojiPicker from "@/components/EmojiPicker";
import { useMediaAccess } from "@/hooks/useMediaAccess";
import { useEnhancedBeautyFilter } from "@/hooks/useEnhancedBeautyFilter";
import { useModerationControls } from "@/hooks/useModerationControls";
import { useAdvancedModeration } from "@/hooks/useAdvancedModeration";
import { useNudityDetection } from "@/hooks/useNudityDetection";
import { useGiftAnimations } from "@/hooks/useGiftAnimations";
import GiftAnimationOverlay from "@/components/GiftAnimationOverlay";

interface StreamerInterfaceProps {
  onEndStream: () => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isViewer: boolean;
  isStreamer?: boolean;
  isModerator?: boolean;
  userId?: string;
}

interface StreamSummary {
  duration: number;
  viewerCount: number;
  newFollowers: number;
  giftsEarned: number;
}

const StreamerInterface = ({ onEndStream }: StreamerInterfaceProps) => {
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [category, setCategory] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [newFollowers, setNewFollowers] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [streamSummary, setStreamSummary] = useState<StreamSummary | null>(null);
  const [message, setMessage] = useState("");
  const [isViewerListOpen, setIsViewerListOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const [showBeautyFilters, setShowBeautyFilters] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const filteredVideoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();
  
  const mediaAccess = useMediaAccess();
  const beautyFilter = useEnhancedBeautyFilter();
  const moderation = useModerationControls();
  const { checkMessage, moderationState } = useAdvancedModeration();
  const nudityDetection = useNudityDetection();
  const giftAnimations = useGiftAnimations();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "MusicLover99",
      message: "Great stream! Love your voice! 🎤",
      timestamp: new Date(),
      isViewer: true,
      userId: "user1"
    },
    {
      id: "2",
      username: "StreamFan42",
      message: "Can you sing my favorite song?",
      timestamp: new Date(),
      isViewer: true,
      userId: "user2"
    },
  ]);

  const [viewers] = useState<Viewer[]>([
    { id: "user1", name: "MusicLover99", avatarUrl: "https://i.pravatar.cc/100?img=1", totalCoins: 120 },
    { id: "user2", name: "StreamFan42", avatarUrl: "https://i.pravatar.cc/100?img=2", totalCoins: 540 },
    { id: "user3", name: "Luna", avatarUrl: "https://i.pravatar.cc/100?img=3", totalCoins: 15 },
    { id: "user4", name: "BeatRider", avatarUrl: "https://i.pravatar.cc/100?img=4", totalCoins: 0 },
    { id: "user5", name: "Melody", avatarUrl: "https://i.pravatar.cc/100?img=5", totalCoins: 1000 },
  ]);

  const categories = ["Music", "Gaming", "Chat", "Art", "Cooking", "Dance", "Tech"];

  const handleGoLive = async () => {
    if (streamTitle.trim() && mediaAccess.hasPermission) {
      // Initialize nudity detection
      await nudityDetection.initializeDetector();
      
      setIsLive(true);
      setViewerCount(1);
      startStreamTimers();
      
      // Start nudity monitoring
      startNudityMonitoring();
    } else if (!mediaAccess.hasPermission) {
      await mediaAccess.requestPermissions();
    }
  };

  const startNudityMonitoring = () => {
    const monitorInterval = setInterval(async () => {
      if (videoRef.current && mediaAccess.stream && mediaAccess.isCameraOn && videoRef.current.readyState >= 2) {
        const result = await nudityDetection.checkVideoFrame(videoRef.current);
        
        if (result.isNudityDetected) {
          if (result.blocked || result.warnings >= 3) {
            toast({
              title: "Stream Automatically Ended",
              description: "Your stream has been terminated due to inappropriate content violations. Please review our community guidelines before streaming again.",
              variant: "destructive"
            });
            handleEndStream();
          } else {
            toast({
              title: `⚠️ Content Warning ${result.warnings}/3`,
              description: `Inappropriate content detected (${Math.round(result.confidence * 100)}% confidence). Please adjust your content immediately or your stream will be terminated.`,
              variant: "destructive"
            });
          }
        }
      }
    }, 3000); // Check every 3 seconds for more responsive detection

    // Store interval for cleanup
    (window as any).nudityMonitorInterval = monitorInterval;
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
    
    // Create summary
    const summary: StreamSummary = {
      duration: streamDuration,
      viewerCount: viewerCount,
      newFollowers: newFollowers,
      giftsEarned: coinsEarned
    };
    
    setStreamSummary(summary);
    setShowSummary(true);
    setIsLive(false);
    
    // Clear intervals
    if ((window as any).streamIntervals) {
      Object.values((window as any).streamIntervals).forEach((interval: any) => {
        clearInterval(interval);
      });
    }
    
    // Clear nudity monitoring
    if ((window as any).nudityMonitorInterval) {
      clearInterval((window as any).nudityMonitorInterval);
    }
    
    // Stop media stream
    mediaAccess.stopStream();
    
    // Clear moderation data
    moderation.clearModerationData();
    
    // Auto close summary after 5 seconds
    setTimeout(() => {
      setShowSummary(false);
      onEndStream();
    }, 5000);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const mod = checkMessage(trimmed);
    if (mod.flagged) {
      toast({ 
        title: "Message blocked", 
        description: mod.reason || "Please be respectful in chat.", 
        variant: "destructive" 
      });
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You (Streamer)",
      message: trimmed,
      timestamp: new Date(),
      isViewer: false,
      isStreamer: true,
      userId: "streamer"
    };
    setChatMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
    setIsScrolledUp(!isAtBottom);
    
    if (isAtBottom) {
      setShowNewMessageIndicator(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessageIndicator(false);
    setIsScrolledUp(false);
  };

  const handleModerationAction = (action: string, messageId: string, userId: string, username: string) => {
    switch (action) {
      case 'mute':
        moderation.muteUser(userId, username);
        toast({ title: `${username} has been muted`, variant: "default" });
        break;
      case 'ban':
        moderation.banUser(userId, username);
        toast({ title: `${username} has been banned`, variant: "destructive" });
        break;
      case 'pin':
        const msg = chatMessages.find(m => m.id === messageId);
        if (msg) {
          moderation.pinMessage(messageId, username, msg.message);
          toast({ title: "Message pinned", variant: "default" });
        }
        break;
      case 'delete':
        moderation.deleteMessage(messageId);
        toast({ title: "Message deleted", variant: "default" });
        break;
    }
  };

  const handleAssignModerator = (userId: string, username: string) => {
    moderation.assignModerator(userId, username);
    toast({ title: `${username} is now a moderator`, variant: "default" });
  };

  // Set video source when stream changes
  useEffect(() => {
    if (videoRef.current && mediaAccess.stream) {
      videoRef.current.srcObject = mediaAccess.stream;
    }
  }, [mediaAccess.stream]);

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
      
      const userId = `user${Math.floor(Math.random() * 100)}`;
      const username = `Viewer${Math.floor(Math.random() * 1000)}`;
      
      if (moderation.isUserBanned(userId)) return;
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        isViewer: true,
        userId,
        isModerator: moderation.isUserModerator(userId)
      };
      
      setChatMessages(prev => [...prev.slice(-15), newMessage]);
      
      if (isScrolledUp) {
        setShowNewMessageIndicator(true);
      }
    }, 4000);

    return () => clearInterval(chatInterval);
  }, [isLive, isScrolledUp]);

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
          {mediaAccess.hasPermission ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="text-8xl">🎥</div>
              <Button
                onClick={mediaAccess.requestPermissions}
                variant="default"
                size="lg"
                disabled={mediaAccess.isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {mediaAccess.isLoading ? "Requesting Access..." : "Enable Camera & Microphone"}
              </Button>
              {mediaAccess.error && (
                <p className="text-red-400 text-sm max-w-md">{mediaAccess.error}</p>
              )}
            </div>
          )}
          
          {/* Camera Controls Overlay */}
          {mediaAccess.hasPermission && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={mediaAccess.switchCamera}
                className="rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBeautyFilters(!showBeautyFilters)}
                    className="rounded-full bg-black/40 text-white hover:bg-black/60"
                  >
                    <div className="text-yellow-400 text-lg">✨</div>
                  </Button>
            </div>
          )}
          
          {/* Beauty Filter Selection Panel */}
          {showBeautyFilters && mediaAccess.hasPermission && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-lg rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Beauty Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBeautyFilters(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {beautyFilter.presets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={beautyFilter.selectedPreset === preset.id ? "default" : "outline"}
                    onClick={() => beautyFilter.setSelectedPreset(preset.id)}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <span className="text-lg mb-1">{preset.emoji}</span>
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
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
              disabled={!streamTitle.trim() || !mediaAccess.hasPermission}
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
        {/* Real-time Video Display with Beauty Filter */}
        {mediaAccess.stream && mediaAccess.isCameraOn ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="hidden"
            />
            <canvas
              ref={(canvas) => {
                if (canvas && videoRef.current) {
                  const updateFrame = () => {
                    if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                      beautyFilter.applyBeautyFilter(videoRef.current, canvas);
                    }
                    animationFrameRef.current = requestAnimationFrame(updateFrame);
                  };
                  updateFrame();
                }
              }}
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          <motion.div
            className="w-full h-full flex items-center justify-center text-8xl"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {mediaAccess.isCameraOn ? "🎤" : "📷"}
          </motion.div>
        )}

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
            <button
              onClick={() => setIsViewerListOpen(true)}
              className="viewer-count cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Eye className="w-4 h-4 mr-1" />
              {viewerCount.toLocaleString()}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={!mediaAccess.isCameraOn ? "destructive" : "ghost"}
              size="icon"
              onClick={mediaAccess.toggleCamera}
              className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              {!mediaAccess.isCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </Button>
            <Button
              variant={!mediaAccess.isMicOn ? "destructive" : "ghost"}
              size="icon"
              onClick={mediaAccess.toggleMic}
              className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              {!mediaAccess.isMicOn ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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

        {/* Pinned Message */}
        {moderation.pinnedMessage && (
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-sm max-w-md">
              <div className="flex items-start gap-2">
                <Pin className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <span className="text-yellow-400 font-bold text-sm">
                    {moderation.pinnedMessage.username}:
                  </span>
                  <span className="text-white ml-2">
                    {moderation.pinnedMessage.message}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={moderation.unpinMessage}
                  className="ml-auto w-6 h-6 text-yellow-400 hover:text-yellow-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Panel */}
        <div className="absolute top-20 left-4 bg-black/60 rounded-xl p-3 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4 text-center text-white text-sm">
            <div>
              <div className="font-bold text-lg text-yellow-400">{coinsEarned}</div>
              <div className="text-xs">Coins Earned</div>
            </div>
            <div>
              <div className="font-bold text-lg text-green-400">{newFollowers}</div>
              <div className="text-xs">New Followers</div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Messages with Transparent Background */}
        <div 
          ref={chatContainerRef}
          className="absolute left-4 bottom-32 right-24 max-h-64 overflow-y-auto scrollbar-hide"
          onScroll={handleChatScroll}
        >
          <AnimatePresence initial={false}>
            <div className="space-y-2">
              {chatMessages
                .filter((m) => !moderation.isMessageDeleted(m.id) && m.id !== moderation.pinnedMessage?.id)
                .map((msg) => {
                  if (moderation.isUserMuted(msg.userId || '') && !msg.isStreamer) return null;
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="group relative"
                    >
                      <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-2 max-w-xs">
                        <span className={`font-bold text-sm ${
                          msg.isStreamer ? 'text-yellow-400' : 
                          msg.isModerator ? 'text-green-400' : 
                          'text-blue-400'
                        }`}>
                          {msg.isModerator && !msg.isStreamer && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mr-1"
                            >
                              🛡️
                            </motion.span>
                          )}
                          {msg.username}:
                        </span>
                        <span className="ml-2 text-white text-sm">{msg.message}</span>
                        
                         {/* Moderation Controls - Only for non-streamer messages */}
                        {!msg.isStreamer && (
                          <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/60 rounded-full p-1">
                            <button
                              onClick={() => handleModerationAction('mute', msg.id, msg.userId || '', msg.username)}
                              className="text-xs text-orange-400 hover:text-orange-300 p-1 rounded-full hover:bg-white/20"
                              title="Mute user"
                            >
                              <MicOff className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleModerationAction('ban', msg.id, msg.userId || '', msg.username)}
                              className="text-xs text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-white/20"
                              title="Ban user"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleModerationAction('pin', msg.id, msg.userId || '', msg.username)}
                              className="text-xs text-yellow-400 hover:text-yellow-300 p-1 rounded-full hover:bg-white/20"
                              title="Pin message"
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleModerationAction('delete', msg.id, msg.userId || '', msg.username)}
                              className="text-xs text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-white/20"
                              title="Delete message"
                            >
                              <Shield className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              <div ref={chatEndRef} />
            </div>
          </AnimatePresence>
          
          {/* New Message Indicator */}
          {showNewMessageIndicator && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={scrollToBottom}
              className="sticky bottom-0 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors"
            >
              New Messages
              <ChevronDown className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        {/* Gift Animation Overlay */}
        <GiftAnimationOverlay />

        {/* Camera Controls */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={mediaAccess.switchCamera}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Input */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2">
            <div className="flex-1 flex bg-black/40 backdrop-blur-sm rounded-full border border-white/20 relative">
              <Input
                placeholder={moderationState.isBanned ? "You are temporarily banned" : "Send a message as streamer..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={moderationState.isBanned}
                className="bg-transparent border-0 text-white placeholder:text-white/70 px-4 py-3 rounded-l-full focus:ring-0 pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-8 h-8"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim() || moderationState.isBanned}
                className="text-white hover:bg-white/20 rounded-r-full"
              >
                <Send className="w-5 h-5" />
              </Button>
              
              {/* Emoji Picker */}
              <EmojiPicker
                isOpen={isEmojiPickerOpen}
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setIsEmojiPickerOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Viewer List Modal */}
      <ViewerListModal 
        isOpen={isViewerListOpen}
        onClose={() => setIsViewerListOpen(false)}
        viewers={viewers}
        onAssignModerator={handleAssignModerator}
        onMuteUser={(userId, username) => handleModerationAction('mute', '', userId, username)}
        onBanUser={(userId, username) => handleModerationAction('ban', '', userId, username)}
        moderatedUsers={moderation.moderatedUsers}
      />

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
              <p className="text-muted-foreground mb-4">
                Are you sure you want to end your stream? Your viewers will be notified.
              </p>
              
              {/* Stream Summary Preview */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-primary">{formatDuration(streamDuration)}</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-400">{viewerCount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Viewers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-400">{newFollowers}</div>
                    <div className="text-xs text-muted-foreground">New Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-400">{coinsEarned}</div>
                    <div className="text-xs text-muted-foreground">Coins Earned</div>
                  </div>
                </div>
              </div>
              
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

      {/* Post-Stream Summary */}
      <AnimatePresence>
        {showSummary && streamSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-3xl p-8 max-w-md w-full text-center border border-primary/20"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Stream Ended!</h2>
              <p className="text-muted-foreground mb-6">Great job on your live stream!</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-primary">{formatDuration(streamSummary.duration)}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-blue-400">{streamSummary.viewerCount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Peak Viewers</div>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-green-400">{streamSummary.newFollowers}</div>
                  <div className="text-sm text-muted-foreground">New Followers</div>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-yellow-400">{streamSummary.giftsEarned}</div>
                  <div className="text-sm text-muted-foreground">Coins Earned</div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Duration: {formatDuration(streamSummary.duration)}, 
                Viewers: {streamSummary.viewerCount.toLocaleString()}, 
                New Followers: {streamSummary.newFollowers}, 
                Gifts earned: {streamSummary.giftsEarned} coins
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamerInterface;