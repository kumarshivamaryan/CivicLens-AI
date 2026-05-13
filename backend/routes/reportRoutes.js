const express = require('express');
const router = express.Router();
const Report = require('../models/Report'); 
const mongoose = require('mongoose'); // [Naya Add Karo]
const { protect, isAdmin } = require('../middleware/authMiddleware');
// Kisi specific user ki reports nikalne ke liye
router.get('/user/:userId', async (req, res) => {
   
  try {
    const { userId } = req.params;

    // Check karo ki ID valid hai ya nahi (safety ke liye)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Yahan change hai: userId ko ObjectId mein convert kiya hai
    const reports = await Report.find({ 
      user: new mongoose.Types.ObjectId(userId) 
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Error fetching user reports" });
  }
});

// routes/reportRoutes.js
router.delete('/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Report deleted successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

router.patch('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Status update karne mein error aaya" });
  }
});

module.exports = router;