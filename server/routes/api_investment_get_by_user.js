// Get investments by user ID
router.get('/investments/user/:id', async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.params.id });
    res.json(investments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
