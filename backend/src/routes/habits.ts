import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { supabaseAdmin } from "../config/supabase";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("archived", false)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const { name, frequency } = req.body;

    if (!name) return res.status(400).json({ error: "Nama habit wajib diisi" });

    const { data, error } = await supabaseAdmin
      .from("habits")
      .insert([{ user_id: userId, name, frequency }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const habitId = req.params.id;

    const { data, error } = await supabaseAdmin
      .from("habits")
      .update(req.body)
      .eq("id", habitId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const habitId = req.params.id;

    const { error } = await supabaseAdmin
      .from("habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", userId);

    if (error) throw error;
    res.json({ message: "Habit dihapus" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
