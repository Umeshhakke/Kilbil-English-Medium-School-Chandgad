// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyAdmin } = require('../middleware/authMiddleware'); // ← add this
const { db, admin } = require('../config/firebase'); // if needed

// Admin login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Get credentials from environment variables
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Check credentials
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Generate JWT token (expires in 24 hours)
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({
    message: 'Login successful',
    token,
    admin: { email: ADMIN_EMAIL }
  });
});
// routes/adminRoutes.js (add these)
router.get('/fee-structure', verifyAdmin, async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('feeStructure').get();
    if (!doc.exists) return res.json({}); // empty defaults
    res.json(doc.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/fee-structure', verifyAdmin, async (req, res) => {
  try {
    const { fees } = req.body; // expects an object mapping class -> amount
    await db.collection('settings').doc('feeStructure').set({ fees, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;