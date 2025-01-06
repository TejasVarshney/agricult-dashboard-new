import { supabase } from "../config/supabase.js";

export const getAudioMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("type", "audio")
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatMessagesByRfqId = async (req, res) => {
  try {
    const { rfqId } = req.params;
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey(*)
      `)
      .eq("rfq_id", rfqId)
      .eq("type", "audio")
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating message status:', { id, status });

    // Validate status
    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Status must be either 'approved' or 'rejected'" 
      });
    }

    // First check if the message exists
    const { data: existingMessage, error: checkError } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("id", id)
      .eq("type", "audio")
      .single();

    if (checkError) {
      console.error('Error checking message:', checkError);
      return res.status(404).json({ error: "Audio message not found" });
    }

    if (!existingMessage) {
      return res.status(404).json({ error: "Audio message not found" });
    }

    // Then update the message - first perform the update
    const { error: updateError } = await supabase
      .from("chat_messages")
      .update({ 
        status: status,
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .eq("type", "audio");

    if (updateError) {
      console.error('Error updating message:', updateError);
      throw updateError;
    }

    // Then fetch the updated record separately
    const { data: updatedMessage, error: fetchError } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error('Error fetching updated message:', fetchError);
      throw fetchError;
    }

    if (!updatedMessage) {
      throw new Error('Failed to fetch updated message');
    }

    console.log('Audio message updated successfully:', updatedMessage);
    res.json({ data: updatedMessage });

  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: error.message });
  }
}; 