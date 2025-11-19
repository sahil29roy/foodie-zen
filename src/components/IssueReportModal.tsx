import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const issueSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  issue: z.string().trim().min(10, "Please describe your issue (minimum 10 characters)").max(500, "Issue description must be less than 500 characters"),
});

export const IssueReportModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input
      const validated = issueSchema.parse({ name, phone, issue });

      // Create WhatsApp message with customer details
      const whatsappNumber = "916206505126"; // India country code + number
      const message = encodeURIComponent(
        `🚨 New Issue Report from FoodExpress\n\n` +
        `👤 Customer Name: ${validated.name}\n` +
        `📱 Customer Phone: ${validated.phone}\n\n` +
        `📋 Issue Description:\n${validated.issue}\n\n` +
        `⏰ Reported at: ${new Date().toLocaleString()}`
      );

      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

      toast({
        title: "Issue report sent!",
        description: "We'll contact you shortly to resolve your issue.",
      });

      // Reset form and close modal
      setName("");
      setPhone("");
      setIssue("");
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit issue. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <AlertCircle className="h-4 w-4" />
          Report an Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Having problems with your order, taste, or payment? Let us know and we'll help you right away!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Your Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue">Describe Your Issue *</Label>
            <Textarea
              id="issue"
              placeholder="Please describe your issue in detail..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              maxLength={500}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Issue Report
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
