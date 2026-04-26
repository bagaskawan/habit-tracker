import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useTranslation } from "react-i18next";

const FONT_CLASSES = ["font-sans", "font-serif", "font-hand"] as const;
const DEFAULT_FONT = "sans";
const DEFAULT_LANGUAGE = "en";

interface UserPreferences {
  language: string;
  font: string;
}

/**
 * Hook untuk fetch dan apply user preferences (font & language) dari database.
 * - Jika data belum ada di DB, otomatis insert row baru dengan nilai default.
 * - Menerapkan font ke <html> classList dan bahasa ke i18n.
 */
export function useUserPreferences() {
  const { user, loading: authLoading } = useAuth();
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Fungsi untuk menerapkan font ke root <html>
  const applyFont = useCallback((font: string) => {
    document.documentElement.classList.remove(...FONT_CLASSES);
    document.documentElement.classList.add(`font-${font}`);
  }, []);

  // Fungsi untuk reset font ke default (sans-serif)
  const resetFont = useCallback(() => {
    document.documentElement.classList.remove(...FONT_CLASSES);
    document.documentElement.classList.add(`font-${DEFAULT_FONT}`);
  }, []);

  // Fetch preferences dari database
  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("language, font")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Data sudah ada → terapkan
          setPreferences({ language: data.language, font: data.font });
          applyFont(data.font);
          i18n.changeLanguage(data.language);
        } else {
          // Data belum ada → insert default, lalu terapkan
          const defaultPrefs: UserPreferences = {
            language: user.user_metadata?.language || DEFAULT_LANGUAGE,
            font: user.user_metadata?.font || DEFAULT_FONT,
          };

          const { error: insertError } = await supabase
            .from("user_preferences")
            .insert({
              user_id: user.id,
              language: defaultPrefs.language,
              font: defaultPrefs.font,
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Gagal membuat preferensi default:", insertError);
          }

          setPreferences(defaultPrefs);
          applyFont(defaultPrefs.font);
          i18n.changeLanguage(defaultPrefs.language);
        }
      } catch (error) {
        console.error("Gagal mengambil preferensi:", error);
        // Fallback ke default jika gagal fetch
        applyFont(DEFAULT_FONT);
      } finally {
        setIsFetching(false);
      }
    }

    if (user) {
      fetchPreferences();
    } else if (!authLoading) {
      setIsFetching(false);
    }
  }, [user, authLoading, i18n, applyFont]);

  // Fungsi untuk update satu preference (language atau font)
  const updatePreference = useCallback(
    async (type: "language" | "font", value: string) => {
      if (!user || !preferences) return;

      // Optimistic update
      const newPrefs = { ...preferences, [type]: value };
      setPreferences(newPrefs);

      if (type === "font") {
        applyFont(value);
      } else {
        i18n.changeLanguage(value);
      }

      try {
        const { error } = await supabase.from("user_preferences").upsert({
          user_id: user.id,
          language: newPrefs.language,
          font: newPrefs.font,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (error) {
        console.error("Gagal menyimpan preferensi:", error);
      }
    },
    [user, preferences, applyFont, i18n],
  );

  return {
    preferences,
    isFetching,
    updatePreference,
    applyFont,
    resetFont,
  };
}
