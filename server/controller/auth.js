import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {

    const { admin , password } = req.body;

    // Check if admin and password are provided
    if (!admin || !password) {
      return res.status(400).json({ message: 'Please provide admin username and password' });
    }

    // Find admin by username
    const adminUser = await Admin.findOne({ admin });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isPasswordMatch = await adminUser.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(adminUser._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
