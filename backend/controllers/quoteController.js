import { supabase } from "../config/supabase.js";

// Get all quotes
export const getAllQuotes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*");

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quote by ID
export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Quote not found" });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new quote
export const createQuote = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update quote
export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("quotes")
      .update(req.body)
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Quote not found" });
    }
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete quote
export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quotes count
export const getQuotesCount = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("quotes")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quotes by RFQ ID
export const getQuotesByRfqId = async (req, res) => {
  try {
    const { rfqId } = req.params;
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        *,
        seller:seller_profiles!quotes_seller_id_fkey(*)
      `)
      .eq("rfq_id", rfqId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get bid status
export const getBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("quotes")
      .select("status")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Bid not found" });
    }
    res.json({ status: data.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update quote status
export const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating quote status:', { id, status });

    const { data, error } = await supabase
      .from("quotes")
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: "Quote not found" });
    }

    console.log('Quote updated successfully:', data);
    res.json({ data });
  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(500).json({ error: error.message });
  }
}; 