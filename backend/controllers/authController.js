const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check karo user pehle se toh nahi hai
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Password ko "Hash" (Hide) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user save karna
        user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // 7 din tak login rahega
        );

        res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
        res.status(201).json({ msg: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // Generate JWT Token (Identity Card)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // 7 din tak login rahega
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};