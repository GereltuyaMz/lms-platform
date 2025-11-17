"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile, checkAndAwardProfileCompletionXP } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

type OnboardingFormProps = {
  initialData?: {
    fullName?: string;
    email?: string;
    avatarUrl?: string;
  };
};

export const OnboardingForm = ({ initialData }: OnboardingFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "");
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    dateOfBirth: "",
    learningGoals: "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Supabase Storage
      // For now, create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!avatarUrl || !formData.dateOfBirth || !formData.learningGoals) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Update profile
      const result = await updateUserProfile({
        fullName: formData.fullName,
        avatarUrl,
        dateOfBirth: formData.dateOfBirth,
        learningGoals: formData.learningGoals,
      });

      if (result.success) {
        // Check and award profile completion XP
        const xpResult = await checkAndAwardProfileCompletionXP();

        if (xpResult.success && xpResult.xpAwarded) {
          toast.success(`🎉 +${xpResult.xpAwarded} XP`, {
            description: "Profile completed! Welcome to the platform!",
            duration: 5000,
          });
        } else {
          toast.success("Profile updated successfully!");
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
        <p className="text-muted-foreground">
          Tell us a bit about yourself to get started
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} alt={formData.fullName} />
          <AvatarFallback className="text-2xl">
            {formData.fullName ? getInitials(formData.fullName) : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <Label
            htmlFor="avatar-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Avatar
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          PNG, JPG or GIF (max. 2MB)
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">
          Full Name <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
      </div>

      {/* Email (Read-only) */}
      {initialData?.email && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={initialData.email}
            disabled
            className="bg-muted"
          />
        </div>
      )}

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          required
          value={formData.dateOfBirth}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          max={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Learning Goals */}
      <div className="space-y-2">
        <Label htmlFor="learningGoals">
          Learning Goals <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="learningGoals"
          placeholder="Tell us what you want to learn and achieve..."
          required
          rows={4}
          value={formData.learningGoals}
          onChange={(e) =>
            setFormData({ ...formData, learningGoals: e.target.value })
          }
        />
        <p className="text-xs text-muted-foreground">
          Describe your learning objectives and what you hope to accomplish
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={isSubmitting}
        >
          Skip for Now
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </div>

      {/* XP Bonus Notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
        <p className="text-sm font-medium">
          🎁 Complete your profile to earn <span className="font-bold">150 XP</span>!
        </p>
      </div>
    </form>
  );
};
