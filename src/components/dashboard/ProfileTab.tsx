"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { updateUserProfile, checkAndAwardProfileCompletionXP } from "@/lib/actions";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

type ProfileTabProps = {
  username: string;
  email: string;
  avatarUrl: string;
  dateOfBirth?: string;
  learningGoals?: string;
};

export const ProfileTab = ({
  username: initialUsername,
  email,
  avatarUrl: initialAvatarUrl,
  dateOfBirth: initialDateOfBirth = "",
  learningGoals: initialLearningGoals = "",
}: ProfileTabProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [dateOfBirth, setDateOfBirth] = useState(initialDateOfBirth);
  const [learningGoals, setLearningGoals] = useState(initialLearningGoals);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Supabase Storage
      // For now, create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
      toast.info("Avatar upload to storage not yet implemented");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateUserProfile({
        fullName: username,
        avatarUrl,
        dateOfBirth,
        learningGoals,
      });

      if (result.success) {
        // Check and award profile completion XP
        const xpResult = await checkAndAwardProfileCompletionXP();

        if (xpResult.success && xpResult.xpAwarded) {
          toast.success(`🎉 +${xpResult.xpAwarded} XP`, {
            description: "Profile completed!",
            duration: 5000,
          });
        } else {
          toast.success("Profile updated successfully!");
        }
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Profile Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 bg-emerald-500">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={username} />
              ) : (
                <AvatarFallback className="bg-emerald-500 text-white text-4xl">
                  {getInitials(username)}
                </AvatarFallback>
              )}
            </Avatar>

            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-xs text-muted-foreground text-center">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Learning Goals */}
              <div className="space-y-2">
                <Label htmlFor="learningGoals">Learning Goals</Label>
                <Textarea
                  id="learningGoals"
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="Describe your learning objectives..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {learningGoals.length} / 500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button type="submit" disabled={isSaving} className="cursor-pointer">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUsername(initialUsername);
                    setAvatarUrl(initialAvatarUrl);
                    setDateOfBirth(initialDateOfBirth);
                    setLearningGoals(initialLearningGoals);
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Courses Enrolled</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Courses Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0h</p>
              <p className="text-sm text-muted-foreground">Learning Time</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Certificates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
