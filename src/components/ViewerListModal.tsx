import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Crown, Shield, UserMinus, Ban } from "lucide-react";
import type { ModeratedUser } from "@/hooks/useModerationControls";

export interface Viewer {
  id: string;
  name: string;
  avatarUrl?: string;
  totalCoins: number;
}

interface ViewerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewers: Viewer[];
  onAssignModerator?: (userId: string, username: string) => void;
  onMuteUser?: (userId: string, username: string) => void;
  onBanUser?: (userId: string, username: string) => void;
  moderatedUsers?: ModeratedUser[];
}

const ViewerListModal = ({ 
  isOpen, 
  onClose, 
  viewers, 
  onAssignModerator,
  onMuteUser,
  onBanUser,
  moderatedUsers = []
}: ViewerListModalProps) => {
  const total = viewers.length;
  const totalCoins = viewers.reduce((sum, v) => sum + v.totalCoins, 0);
  
  const getModeratedStatus = (userId: string) => {
    return moderatedUsers.find(u => u.id === userId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> Viewers ({total})
          </DialogTitle>
          <DialogDescription>
            Total gifts sent: {totalCoins.toLocaleString()} coins
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 pr-2">
          <div className="space-y-3">
            {viewers.map((v) => {
              const moderatedStatus = getModeratedStatus(v.id);
              const isModerator = moderatedStatus?.isModerator || false;
              const isMuted = moderatedStatus?.status === 'muted';
              const isBanned = moderatedStatus?.status === 'banned';
              
              return (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={v.avatarUrl} alt={`${v.name} profile image`} />
                        <AvatarFallback>{v.name.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {isModerator && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isModerator ? 'text-green-400' : 'text-foreground'}`}>
                          {isModerator && '🛡️ '}{v.name}
                        </span>
                        {isMuted && <Badge variant="destructive" className="text-xs">Muted</Badge>}
                        {isBanned && <Badge variant="destructive" className="text-xs">Banned</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {v.totalCoins.toLocaleString()} coins • ID: {v.id}
                      </div>
                    </div>
                  </div>
                  
                  {/* Moderation Controls */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isModerator && onAssignModerator && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAssignModerator(v.id, v.name)}
                        className="w-8 h-8 text-green-500 hover:text-green-400"
                        title="Assign Moderator"
                      >
                        <Crown className="w-4 h-4" />
                      </Button>
                    )}
                    {!isMuted && onMuteUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMuteUser(v.id, v.name)}
                        className="w-8 h-8 text-yellow-500 hover:text-yellow-400"
                        title="Mute User"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                    {!isBanned && onBanUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onBanUser(v.id, v.name)}
                        className="w-8 h-8 text-red-500 hover:text-red-400"
                        title="Ban User"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewerListModal;
