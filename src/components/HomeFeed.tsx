import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Video, 
  Eye, 
  Heart, 
  MessageCircle, 
  User, 
  Wallet, 
  Bell,
  Filter,
  Search
} from "lucide-react";
import { motion } from "framer-motion";

interface HomeFeedProps {
  onStreamSelect: (streamId: string) => void;
  onGoLive: () => void;
  onProfileClick: () => void;
  onNotificationClick: () => void;
  onWalletClick: () => void;
  onChatClick: () => void;
}

const HomeFeed = ({ onStreamSelect, onGoLive, onProfileClick, onNotificationClick, onWalletClick, onChatClick }: HomeFeedProps) => {
  const [activeFilter, setActiveFilter] = useState("Popular 🏆");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["Popular 🏆", "Nearby 📍", "New", "Music", "Gaming", "Chat"];

  const liveStreams = [
    {
      id: "1",
      streamer: "Alice_Sunshine",
      title: "Late Night Singing 🎤",
      viewers: 24000,
      thumbnail: "🎤",
      category: "Music",
      isLive: true,
      likes: 1500,
    },
    {
      id: "2", 
      streamer: "GameMaster_Pro",
      title: "Epic Gaming Session",
      viewers: 18500,
      thumbnail: "🎮",
      category: "Gaming",
      isLive: true,
      likes: 890,
    },
    {
      id: "3",
      streamer: "Chef_Bella",
      title: "Cooking Italian Tonight",
      viewers: 12300,
      thumbnail: "👩‍🍳",
      category: "Lifestyle", 
      isLive: true,
      likes: 670,
    },
    {
      id: "4",
      streamer: "Dance_Queen_99",
      title: "Dance Battle Challenge",
      viewers: 31200,
      thumbnail: "💃",
      category: "Dance",
      isLive: true,
      likes: 2100,
    },
    {
      id: "5",
      streamer: "Tech_Wizard",
      title: "Building Cool Apps",
      viewers: 8900,
      thumbnail: "💻",
      category: "Tech",
      isLive: true,
      likes: 445,
    },
    {
      id: "6",
      streamer: "Art_Goddess",
      title: "Digital Art Stream",
      viewers: 15600,
      thumbnail: "🎨",
      category: "Art",
      isLive: true,
      likes: 780,
    },
  ];

  // Enhanced filtering and sorting logic
  const filteredAndSortedStreams = (() => {
    let filtered = liveStreams.filter(stream =>
      stream.streamer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting based on active filter
    switch (activeFilter) {
      case "Popular 🏆":
        return filtered.sort((a, b) => b.viewers - a.viewers);
      case "Nearby 📍":
        // For demo purposes, we'll simulate geolocation sorting
        // In a real app, this would use actual geolocation API
        return filtered.sort(() => Math.random() - 0.5);
      case "New":
        return filtered.sort(() => Math.random() - 0.5);
      case "Music":
        return filtered.filter(s => s.category === "Music");
      case "Gaming":
        return filtered.filter(s => s.category === "Gaming");
      case "Chat":
        return filtered.filter(s => s.category === "Chat");
      default:
        return filtered;
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-gradient-primary">Demo Streaming App</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={onNotificationClick}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onWalletClick}>
              <Wallet className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search streamers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-card border-border"
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="whitespace-nowrap rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Live Streams Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredAndSortedStreams.map((stream, index) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onStreamSelect(stream.id)}
              className="stream-card cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-4xl">{stream.thumbnail}</div>
                
                {/* Live Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className="live-indicator text-xs">LIVE</Badge>
                </div>

                {/* Viewer Count */}
                <div className="absolute top-2 right-2">
                  <div className="viewer-count">
                    <Eye className="w-3 h-3 mr-1" />
                    {stream.viewers > 1000 ? `${(stream.viewers/1000).toFixed(1)}k` : stream.viewers}
                  </div>
                </div>

                {/* Floating Hearts */}
                <div className="absolute bottom-2 right-2">
                  <motion.div
                    animate={{ y: [-10, -20, -10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-red-500"
                  >
                    ❤️
                  </motion.div>
                </div>
              </div>

              {/* Stream Info */}
              <div className="p-3">
                <h3 className="font-bold text-foreground truncate mb-1">{stream.streamer}</h3>
                <p className="text-sm text-muted-foreground truncate mb-2">{stream.title}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{stream.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3 text-red-500" />
                    {stream.likes}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" size="icon" className="flex-col gap-1 h-auto py-2">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={onChatClick}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chats</span>
          </Button>

          {/* Go Live Button - Center */}
          <Button
            onClick={onGoLive}
            variant="live"
            size="lg"
            className="rounded-full w-16 h-16 relative"
          >
            <Video className="w-[30px] h-[30px]" />
          </Button>

          <Button 
            variant="ghost" 
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={onWalletClick}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="flex-col gap-1 h-auto py-2"
            onClick={onProfileClick}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      {/* Extra bottom padding */}
      <div className="h-20" />
    </div>
  );
};

export default HomeFeed;