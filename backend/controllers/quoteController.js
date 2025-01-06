import { supabase } from "../config/supabase.js";
import cors from 'cors';
import express from 'express';

const router = express.Router();

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

router.use(cors(corsOptions));

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
// updateQuoteStatus function in quoteController.js
export const updateQuoteStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    console.log('Updating quote status:', { id, status });

    // Validate status
    const validStatuses = ['approved', 'rejected', 'pending'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: "Invalid status. Status must be 'approved', 'rejected', or 'pending'" 
      });
    }

    // First check if the quote exists
    const { data: existingQuote, error: checkError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      console.error('Error checking quote:', checkError);
      return res.status(404).json({ error: "Quote not found" });
    }

    if (!existingQuote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    else {
      console.log('Quote found:', existingQuote);
    }

    // Update the quote - Remove .single() and handle array response
    const { data, error: updateError } = await supabase
      .from("quotes")
      .update({ 
        status: status.toLowerCase(),
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select();  // Removed .single()

    if (updateError) {
      console.error('Error updating quote:', updateError);
      throw updateError;
    }

    // Check if we got updated data
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Failed to update quote" });
    }

    console.log('Quote updated successfully:', data);
    res.json({ data: data[0] }); // Return the first item from the array

  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(500).json({ error: error.message });
  }
};