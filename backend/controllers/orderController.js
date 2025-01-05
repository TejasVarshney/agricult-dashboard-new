export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 