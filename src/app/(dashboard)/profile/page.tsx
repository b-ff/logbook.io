import { getProfile } from "@/lib/supabase/profile-actions";
import { getUserSettings } from "@/lib/supabase/settings-actions";
import { signOut } from "@/lib/supabase/auth-actions";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Mail, Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilePage() {
  const profile = await getProfile();
  const settings = await getUserSettings();

  if (!profile) {
    redirect("/login");
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {profile.full_name || "Anonymous User"}
                    </h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <UserIcon className="h-5 w-5" />
                  <span>Vehicle Owner</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span>{profile.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Account</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettingsForm initialSettings={settings} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
