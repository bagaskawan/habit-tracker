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

export function UserSettings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {loading && <LoadingScreen message="Loading settings..." />}
      <div className="flex w-full justify-center px-4 py-16 md:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-4">
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
                <RadioGroup defaultValue="id" className="flex space-x-4 mt-2">
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
                <RadioGroup defaultValue="sans" className="flex space-x-4 mt-2">
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
