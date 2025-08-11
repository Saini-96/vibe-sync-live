import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Settings, 
  Edit, 
  Users, 
  Heart, 
  Coins, 
  Clock,
  Trophy,
  Star,
  Crown,
  Share2,
  MessageCircle,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";

interface UserProfileProps {
  onBack: () => void;
  isOwnProfile?: boolean;
}

const UserProfile = ({ onBack, isOwnProfile = true }: UserProfileProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const profileData = {
    username: "Alice_Sunshine",
    bio: "🎤 Singer & Performer | 🌟 Spreading joy through music | 💕 Thanks for watching!",
    profilePic: "👩‍🎤",
    followers: 124500,
    following: 892,
    totalLikes: 2.4,
    coinsEarned: 45200,
    streamingHours: 234,
    level: 8,
    badges: ["🏆", "🎵", "💎", "👑"],
    isVerified: true,
    isLive: false,
  };

  const stats = [
    {
      label: "Followers",
      value: profileData.followers > 1000 ? `${(profileData.followers/1000).toFixed(1)}K` : profileData.followers.toString(),
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Following", 
      value: profileData.following.toString(),
      icon: UserPlus,
      color: "text-green-400",
    },
    {
      label: "Total Likes",
      value: `${profileData.totalLikes}M`,
      icon: Heart,
      color: "text-red-400",
    },
    {
      label: isOwnProfile ? "Coins Earned" : "Level",
      value: isOwnProfile ? profileData.coinsEarned.toLocaleString() : profileData.level.toString(),
      icon: isOwnProfile ? Coins : Trophy,
      color: "text-yellow-400",
    },
  ];

  const achievements = [
    { name: "First Stream", icon: "🎬", earned: true },
    { name: "100 Followers", icon: "👥", earned: true },
    { name: "Rising Star", icon: "⭐", earned: true },
    { name: "Gift Master", icon: "🎁", earned: true },
    { name: "Top Streamer", icon: "👑", earned: false },
    { name: "Music Legend", icon: "🎵", earned: true },
  ];

  const recentStreams = [
    { title: "Late Night Singing", duration: "2h 15m", viewers: "24K", date: "2 days ago" },
    { title: "Acoustic Session", duration: "1h 45m", viewers: "18K", date: "5 days ago" },
    { title: "Cover Songs Request", duration: "3h 20m", viewers: "31K", date: "1 week ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-gradient-primary">
            {isOwnProfile ? "My Profile" : profileData.username}
          </h1>
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <Button variant="ghost" size="icon">
                <Settings className="w-6 h-6" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon">
                <Share2 className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="pb-20">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-br from-primary via-secondary to-accent" />
          
          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl border-4 border-background">
                {profileData.profilePic}
              </div>
              {profileData.isLive && (
                <div className="absolute -top-1 -right-1">
                  <Badge className="live-indicator text-xs px-2">LIVE</Badge>
                </div>
              )}
              {profileData.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-2xl font-black text-foreground">{profileData.username}</h2>
            {profileData.badges.map((badge, index) => (
              <span key={index} className="text-lg">{badge}</span>
            ))}
          </div>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {profileData.bio}
          </p>

          {/* Action Buttons */}
          {isOwnProfile ? (
            <div className="flex gap-3 mb-6">
              <Button variant="outline" className="flex-1 rounded-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="secondary" className="flex-1 rounded-full">
                <Crown className="w-4 h-4 mr-2" />
                Go Live
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 mb-6">
              <Button
                variant={isFollowing ? "outline" : "follow"}
                onClick={() => setIsFollowing(!isFollowing)}
                className="flex-1 rounded-full"
              >
                {isFollowing ? "Following" : <><UserPlus className="w-4 h-4 mr-2" />Follow</>}
              </Button>
              <Button variant="secondary" className="rounded-full">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-4 text-center border border-border"
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-black text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="px-6 mb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card rounded-xl p-3 text-center border transition-all ${
                  achievement.earned 
                    ? "border-primary shadow-neon" 
                    : "border-border opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-xs text-muted-foreground">{achievement.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Streams */}
        {isOwnProfile && (
          <div className="px-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Streams</h3>
            <div className="space-y-3">
              {recentStreams.map((stream, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-foreground">{stream.title}</h4>
                    <Badge variant="secondary" className="text-xs">{stream.date}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {stream.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {stream.viewers} viewers
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Streaming Time */}
        {isOwnProfile && (
          <div className="px-6 mb-8">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-primary/30">
              <div className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-black text-foreground mb-1">
                  {profileData.streamingHours}h
                </div>
                <div className="text-sm text-muted-foreground">Total Streaming Time</div>
                <div className="text-xs text-primary mt-2">Keep streaming to unlock more rewards!</div>
              </div>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="px-6 mb-8">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-foreground">Level {profileData.level}</span>
              </div>
              <span className="text-sm text-muted-foreground">Next: Level {profileData.level + 1}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "68%" }}
              />
            </div>
            <div className="text-xs text-muted-foreground">2,340 / 3,500 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;