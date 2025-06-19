import { useState } from "react";
import { User, Shield, Bell, Palette, Globe, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";

export default function Settings() {
  const { user, theme, toggleTheme, showToast } = useApp();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    promotions: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const handleProfileUpdate = () => {
    showToast("Profile updated successfully", "success");
  };

  const handlePasswordChange = () => {
    showToast("Password change email sent", "info");
  };

  const handleLogout = () => {
    showToast("Logged out successfully", "success");
    // Handle logout logic here
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-secondary-dark border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary-dark border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-secondary-dark border-gray-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleProfileUpdate}
                  className="gradient-accent text-primary-dark hover:opacity-90"
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={security.twoFactor}
                onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Login Alerts</h4>
                <p className="text-gray-400 text-sm">Get notified of new logins to your account</p>
              </div>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Session Timeout</h4>
                <p className="text-gray-400 text-sm">Auto logout after inactivity</p>
              </div>
              <Select
                value={security.sessionTimeout}
                onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
              >
                <SelectTrigger className="w-32 bg-secondary-dark border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handlePasswordChange}
                variant="outline"
                className="border-gray-600 text-white hover:bg-secondary-dark"
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-gray-400 text-sm">Receive important updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">SMS Notifications</h4>
                <p className="text-gray-400 text-sm">Get bet results and balance updates via SMS</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-gray-400 text-sm">Browser notifications for real-time updates</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Promotional Offers</h4>
                <p className="text-gray-400 text-sm">Receive notifications about bonuses and promotions</p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Dark Mode</h4>
                <p className="text-gray-400 text-sm">Toggle between light and dark themes</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Language</h4>
                <p className="text-gray-400 text-sm">Choose your preferred language</p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-32 bg-secondary-dark border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Support & Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-secondary-dark justify-start"
                onClick={() => showToast("FAQ page opened", "info")}
              >
                <Globe className="w-4 h-4 mr-2" />
                FAQ & Help Center
              </Button>
              
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-secondary-dark justify-start"
                onClick={() => showToast("Contact form opened", "info")}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <div className="text-sm text-gray-400 space-y-1">
              <p>📧 Email: support@betpro.com</p>
              <p>📞 Phone: +91 1800-123-4567 (24/7)</p>
              <p>💬 Live Chat: Available 24/7</p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-morphism border-danger-red">
          <CardHeader>
            <CardTitle className="text-danger-red flex items-center">
              <LogOut className="w-5 h-5 mr-2" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Sign Out</h4>
                <p className="text-gray-400 text-sm">Sign out from your account on this device</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-danger-red text-danger-red hover:bg-danger-red hover:text-white"
              >
                Sign Out
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-danger-red font-medium">Delete Account</h4>
                <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
              </div>
              <Button
                variant="outline"
                className="border-danger-red text-danger-red hover:bg-danger-red hover:text-white"
                onClick={() => showToast("Please contact support to delete account", "info")}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
