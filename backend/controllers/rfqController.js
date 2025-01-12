import { supabase } from "../config/supabase.js";

// Get all RFQs
export const getAllRfqs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rfqs")
      .select("*");

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get count of active RFQs
export const getActiveRfqsCount = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("rfqs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get count of ended RFQs
export const getEndedRfqsCount = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("rfqs")
      .select("*", { count: "exact", head: true })
      .eq("status", "closed");

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total count of RFQs
export const getTotalRfqsCount = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("rfqs")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new RFQ
export const createRfq = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rfqs")
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete RFQ
export const deleteRfq = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("rfqs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.status(200).json({ message: "RFQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRfqById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("rfqs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "RFQ not found" });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendingRfqs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rfqs")
      .select(`
        *,
        buyer:buyer_profiles(*)
      `)
      .eq("status", "pending")
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRfqStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating RFQ status:', { id, status });

    // Validate status
    const validStatuses = ['approved', 'rejected', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Status must be 'approved', 'rejected', or 'pending'" 
      });
    }

    // First check if the RFQ exists
    const { data: existingRfq, error: checkError } = await supabase
      .from("rfqs")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      console.error('Error checking RFQ:', checkError);
      return res.status(404).json({ error: "RFQ not found" });
    }

    if (!existingRfq) {
      return res.status(404).json({ error: "RFQ not found" });
    }

    // Then update the RFQ
    const { data, error: updateError } = await supabase
      .from("rfqs")
      .update({ 
        status: status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating RFQ:', updateError);
      throw updateError;
    }

    console.log('RFQ updated successfully:', data);
    res.json({ data });

  } catch (error) {
    console.error('Error updating RFQ status:', error);
    res.status(500).json({ error: error.message });
  }
}; 