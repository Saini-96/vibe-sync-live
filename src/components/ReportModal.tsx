import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Flag,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
  streamerName: string;
}

const ReportModal = ({ isOpen, onClose, streamId, streamerName }: ReportModalProps) => {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { id: "inappropriate_content", label: "Inappropriate Content", description: "Adult content, violence, or disturbing material" },
    { id: "harassment", label: "Harassment or Bullying", description: "Targeting individuals with abuse or threats" },
    { id: "spam", label: "Spam or Scam", description: "Repetitive content or fraudulent activities" },
    { id: "illegal_activity", label: "Illegal Activity", description: "Criminal behavior or illegal substances" },
    { id: "hate_speech", label: "Hate Speech", description: "Discriminatory language or content" },
    { id: "copyright", label: "Copyright Violation", description: "Unauthorized use of copyrighted material" },
    { id: "other", label: "Other", description: "Other violations not listed above" }
  ];

  const handleSubmit = async () => {
    if (!reportType) {
      toast({
        title: "Please select a report type",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would send to backend
    console.log({
      streamId,
      streamerName,
      reportType,
      description,
      timestamp: new Date()
    });

    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe. We'll review this report shortly."
    });

    setIsSubmitting(false);
    setReportType("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-card rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Flag className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Report Stream</h2>
                <p className="text-sm text-muted-foreground">Report @{streamerName}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Please help us keep the community safe
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    False reports may result in restrictions on your account
                  </p>
                </div>
              </div>
            </div>

            {/* Report Type Selection */}
            <div>
              <Label className="text-base font-semibold text-foreground mb-4 block">
                What's happening?
              </Label>
              <RadioGroup value={reportType} onValueChange={setReportType}>
                <div className="space-y-3">
                  {reportTypes.map((type) => (
                    <div key={type.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={type.id} className="font-medium text-foreground cursor-pointer">
                          {type.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Additional Details */}
            <div>
              <Label htmlFor="description" className="text-base font-semibold text-foreground mb-2 block">
                Additional details (optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Provide more context about this report..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!reportType || isSubmitting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportModal;