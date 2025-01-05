import { supabase } from "../config/supabase.js";

export const getBuyersCount = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("buyer_profiles")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBuyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("buyer_profiles")
      .select("*");

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBuyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("buyer_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 