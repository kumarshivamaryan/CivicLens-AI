const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check karo ki headers mein token hai ya nahi
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. "Bearer <token>" mein se sirf <token> uthao
      token = req.headers.authorization.split(' ')[1];

      // 3. Token ko verify karo (Secret Key se)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. User ka data find karke 'req.user' mein daal do (Password chhod kar)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Sab sahi hai, aage badho!
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token galat hai ya expire ho gaya hai' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Authorization fail: Token nahi mila' });
  }
};

// 🛡️ Admin Check Middleware
const isAdmin = (req, res, next) => {
  // Check karo ki req.user exist karta hai aur uska role 'admin' hai
  if (req.user && req.user.role === 'admin') {
    next(); // Permission Granted!
  } else {
    res.status(403).json({ message: 'Access Denied: Sirf Admin hi ye kar sakta hai' });
  }
};

module.exports = { protect, isAdmin };