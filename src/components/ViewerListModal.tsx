import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye } from "lucide-react";

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
}

const ViewerListModal = ({ isOpen, onClose, viewers }: ViewerListModalProps) => {
  const total = viewers.length;
  const totalCoins = viewers.reduce((sum, v) => sum + v.totalCoins, 0);

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
            {viewers.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={v.avatarUrl} alt={`${v.name} profile image`} />
                    <AvatarFallback>{v.name.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">{v.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {v.id}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-foreground">{v.totalCoins.toLocaleString()} coins</div>
              </div>
            ))}
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
