import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  UserX, 
  MessageSquare, 
  LogOut, 
  Shield, 
  Settings,
  Send,
  X,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SettingsModal = ({ isOpen, onClose, onLogout }: SettingsModalProps) => {
  const [blockedUsers, setBlockedUsers] = useState([
    "toxic_user123",
    "spam_account",
    "inappropriate_user"
  ]);
  
  const [supportForm, setSupportForm] = useState({
    subject: "",
    description: "",
    category: "general"
  });

  const handleUnblockUser = (username: string) => {
    setBlockedUsers(prev => prev.filter(user => user !== username));
    toast.success(`Unblocked ${username}`);
  };

  const handleSupportSubmit = () => {
    if (!supportForm.subject || !supportForm.description) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Simulate form submission
    toast.success("Support ticket submitted successfully!");
    setSupportForm({ subject: "", description: "", category: "general" });
  };

  const handleLogout = () => {
    onLogout();
    onClose();
    toast.success("Logged out successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="blocked" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blocked" className="space-y-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <UserX className="w-4 h-4" />
                <h3 className="font-semibold">Blocked Users</h3>
              </div>
              
              {blockedUsers.length === 0 ? (
                <p className="text-muted-foreground text-sm">No blocked users</p>
              ) : (
                <div className="space-y-2">
                  {blockedUsers.map((username) => (
                    <div key={username} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{username}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUnblockUser(username)}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4" />
                <h3 className="font-semibold">Customer Support</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select 
                    className="w-full p-2 border rounded-md bg-background"
                    value={supportForm.category}
                    onChange={(e) => setSupportForm(prev => ({...prev, category: e.target.value}))}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="coins">Coin Purchase Issues</option>
                    <option value="gifting">Gifting Problems</option>
                    <option value="inappropriate">Report Inappropriate Behavior</option>
                    <option value="technical">Technical Issues</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm(prev => ({...prev, subject: e.target.value}))}
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={supportForm.description}
                    onChange={(e) => setSupportForm(prev => ({...prev, description: e.target.value}))}
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                  />
                </div>
                
                <Button onClick={handleSupportSubmit} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Support Ticket
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4" />
                <h3 className="font-semibold">Privacy Policy</h3>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h4>Information We Collect</h4>
                <p>We collect information you provide directly to us, such as when you create an account, participate in live streams, or contact us for support.</p>
                
                <h4>How We Use Your Information</h4>
                <p>We use the information we collect to provide, maintain, and improve our live streaming services, process transactions, and communicate with you.</p>
                
                <h4>Information Sharing</h4>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                
                <h4>Data Security</h4>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                
                <h4>Your Rights</h4>
                <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
                
                <h4>Contact Us</h4>
                <p>If you have any questions about this Privacy Policy, please contact our support team through the Support tab.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <LogOut className="w-4 h-4" />
                <h3 className="font-semibold">Account Management</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h4 className="font-medium text-destructive mb-2">Logout</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    This will sign you out of your account. You'll need to log in again to access your profile.
                  </p>
                  <Button variant="destructive" onClick={handleLogout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;