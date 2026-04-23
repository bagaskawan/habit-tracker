import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { GithubButton } from "@/components/auth/GithubButton";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function Login() {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) return <div className="min-h-screen bg-background" />;
  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {loading && <LoadingScreen message="Please wait" />}
      <div className="flex w-full bg-card text-card-foreground">
        {/* Left Form Section */}
        <div className="flex w-full flex-col justify-center px-8 py-16 md:w-1/2 md:px-16 lg:px-24">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-10 text-center">
              <h1 className="mb-2 font-serif text-4xl font-semibold">
                Hai Achievers!!!
              </h1>
              <h2 className="text-lg text-muted-foreground">
                Don't just track tasks. Build the habits that shape your NEW
                IDENTITY
              </h2>
            </div>

            <div className="space-y-3">
              <GoogleButton onClick={() => handleOAuth("google")} />
              <GithubButton onClick={() => handleOAuth("github")} />
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hidden w-1/2 md:block">
          <div className="relative h-full w-full">
            <img
              src="/habits.png"
              alt="Habit Tracker"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Carousel dots placeholder matching design */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              <div className="h-1.5 w-6 rounded-full bg-white opacity-80"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-white opacity-40"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-white opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
