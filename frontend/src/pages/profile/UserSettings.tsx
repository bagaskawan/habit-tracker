import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/supabaseClient";

export function UserSettings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetchingPrefs, setIsFetchingPrefs] = useState(true);
  const [language, setLanguage] = useState("");
  const [font, setFont] = useState("");

  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return;
      try {
        // Gunakan maybeSingle() agar tidak error jika data belum ada
        const { data, error } = await supabase
          .from("user_preferences")
          .select("language, font")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Jika data sudah ada, gunakan data tersebut
          setLanguage(data.language);
          setFont(data.font);

          document.documentElement.classList.remove(
            "font-sans",
            "font-serif",
            "font-hand",
          );
          document.documentElement.classList.add(`font-${data.font}`);
        } else {
          // Jika data belum ada, buat data baru (Insert) dengan nilai default
          const defaultLanguage = user.user_metadata?.language || "en";
          const defaultFont = user.user_metadata?.font || "hand";

          const { error: insertError } = await supabase
            .from("user_preferences")
            .insert({
              user_id: user.id,
              language: defaultLanguage,
              font: defaultFont,
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Gagal membuat preferensi default:", insertError);
          } else {
            setLanguage(defaultLanguage);
            setFont(defaultFont);

            document.documentElement.classList.remove(
              "font-sans",
              "font-serif",
              "font-hand",
            );
            document.documentElement.classList.add(`font-${defaultFont}`);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil preferensi:", error);
      } finally {
        setIsFetchingPrefs(false);
      }
    }

    if (user) {
      fetchPreferences();
    } else if (!loading) {
      setIsFetchingPrefs(false);
    }
  }, [user, loading]);

  const handlePreferenceChange = async (
    type: "language" | "font",
    value: string,
  ) => {
    if (!user) return;
    setIsUpdating(true);

    try {
      // Upsert data ke Supabase table user_preferences
      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        [type]: value,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      if (type === "language") {
        setLanguage(value);
        // TODO: Terapkan logika ganti bahasa (i18n) di sini
      } else if (type === "font") {
        setFont(value);
        // Manipulasi root HTML class untuk ubah font global secara instan
        document.documentElement.classList.remove(
          "font-sans",
          "font-serif",
          "font-hand",
        );
        document.documentElement.classList.add(`font-${value}`);
      }
    } catch (error) {
      console.error("Gagal menyimpan preferensi:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || isFetchingPrefs) {
    return <LoadingScreen message="Loading settings..." />;
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full justify-center px-4 py-16 md:px-6 lg:px-8">
        {isUpdating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-[2px] transition-all duration-300">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
          </div>
        )}
        <div
          className={`w-full max-w-lg space-y-4 transition-opacity duration-300 ${isUpdating ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="w-fit pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card className="w-full shadow-md">
            <CardHeader className="flex flex-col items-center gap-3 pb-8 pt-10">
              <Avatar className="h-28 w-28 shadow-sm">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    "Habit User"}
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  {user?.email}
                </CardDescription>
              </div>
            </CardHeader>
            <Separator className="my-4" />
            <CardContent className="space-y-6 px-8 pb-10">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Set Language
                </Label>
                <RadioGroup
                  value={language}
                  onValueChange={(val) =>
                    handlePreferenceChange("language", val)
                  }
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="id" id="lang-id" />
                    <Label
                      htmlFor="lang-id"
                      className="font-normal cursor-pointer"
                    >
                      Indonesia
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label
                      htmlFor="lang-en"
                      className="font-normal cursor-pointer"
                    >
                      English
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Set Font
                </Label>
                <RadioGroup
                  value={font}
                  onValueChange={(val) => handlePreferenceChange("font", val)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sans" id="font-sans" />
                    <Label
                      htmlFor="font-sans"
                      className="font-normal cursor-pointer"
                    >
                      Sans Serif
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="serif" id="font-serif" />
                    <Label
                      htmlFor="font-serif"
                      className="font-normal cursor-pointer"
                    >
                      Serif
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hand" id="font-hand" />
                    <Label
                      htmlFor="font-hand"
                      className="font-normal cursor-pointer"
                    >
                      Handwritten
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
