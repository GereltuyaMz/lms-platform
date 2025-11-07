"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Upload } from "lucide-react";

type ProfileTabProps = {
  username: string;
  email: string;
  avatarUrl: string;
};

export const ProfileTab = ({
  username: initialUsername,
  email,
  avatarUrl,
}: ProfileTabProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      // Show success message (Phase 0 - no actual saving)
      alert("Profile updated successfully! (Mock - not saved)");
    }, 1000);
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

            <Button variant="outline" className="w-full" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
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

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length} / 500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUsername(initialUsername);
                    setBio("");
                  }}
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
