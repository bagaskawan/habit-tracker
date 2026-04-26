import { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export function UserSettings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { preferences, isFetching, updatePreference } = useUserPreferences();
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePreferenceChange = async (
    type: "language" | "font",
    value: string,
  ) => {
    setIsUpdating(true);
    await updatePreference(type, value);
    setIsUpdating(false);
  };

  if (loading || isFetching) {
    return <LoadingScreen message={t("loading.loading_settings")} />;
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full justify-center px-4 py-16 md:px-6 lg:px-8">
        {/* Overlay transisi "vibe coding" */}
        {isUpdating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md transition-all duration-300">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
          </div>
        )}
        <div
          className={`w-full max-w-lg space-y-4 transition-all duration-300 ${isUpdating ? "scale-[0.98] opacity-60 pointer-events-none" : "scale-100 opacity-100"}`}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="w-fit pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("settings.back")}
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
                  {t("settings.set_language")}
                </Label>
                <RadioGroup
                  value={preferences?.language || "en"}
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
                      {t("settings.lang_id")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label
                      htmlFor="lang-en"
                      className="font-normal cursor-pointer"
                    >
                      {t("settings.lang_en")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  {t("settings.set_font")}
                </Label>
                <RadioGroup
                  value={preferences?.font || "sans"}
                  onValueChange={(val) => handlePreferenceChange("font", val)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sans" id="font-sans" />
                    <Label
                      htmlFor="font-sans"
                      className="font-normal cursor-pointer"
                    >
                      {t("settings.font_sans")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="serif" id="font-serif" />
                    <Label
                      htmlFor="font-serif"
                      className="font-normal cursor-pointer"
                    >
                      {t("settings.font_serif")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hand" id="font-hand" />
                    <Label
                      htmlFor="font-hand"
                      className="font-normal cursor-pointer"
                    >
                      {t("settings.font_hand")}
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
