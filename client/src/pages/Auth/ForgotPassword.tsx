import { useState } from "react";
import { Link } from "wouter";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";

export default function ForgotPassword() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    // Mock password reset
    setIsSubmitted(true);
    showToast("Password reset link sent to your email", "success");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="glass-morphism border-0">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-dark" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to{" "}
                <span className="text-accent-green font-semibold">{email}</span>
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full border-gray-600 hover:bg-secondary-dark text-white"
                >
                  Try Another Email
                </Button>
                <Link href="/login">
                  <Button className="w-full gradient-accent text-primary-dark font-semibold hover:opacity-90">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="glass-morphism border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-accent-green mb-2">
              Reset Password
            </CardTitle>
            <p className="text-gray-400">
              Enter your email and we'll send you a link to reset your password
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary-dark border-gray-600 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-accent text-primary-dark font-semibold py-3 hover:opacity-90"
              >
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login">
                <a className="inline-flex items-center text-accent-green hover:underline">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
