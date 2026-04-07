import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, companyName, phoneNumber, address } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password, role, companyName, phoneNumber, address });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                bankName: user.bankName,
                accountNumber: user.accountNumber,
                ifscCode: user.ifscCode,
                accountHolderName: user.accountHolderName,
                razorpayAccountId: user.razorpayAccountId,
                logoURL: user.logoURL,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                bankName: user.bankName,
                accountNumber: user.accountNumber,
                ifscCode: user.ifscCode,
                accountHolderName: user.accountHolderName,
                razorpayAccountId: user.razorpayAccountId,
                logoURL: user.logoURL,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                yearEstablished: user.yearEstablished,
                natureOfBusiness: user.natureOfBusiness,
                bankName: user.bankName,
                accountNumber: user.accountNumber,
                ifscCode: user.ifscCode,
                accountHolderName: user.accountHolderName,
                razorpayAccountId: user.razorpayAccountId,
                logoURL: user.logoURL
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                companyName: user.companyName,
                address: user.address,
                logoURL: user.logoURL,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.companyName = req.body.companyName || user.companyName;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
            user.address = req.body.address || user.address;
            user.yearEstablished = req.body.yearEstablished || user.yearEstablished;
            user.natureOfBusiness = req.body.natureOfBusiness || user.natureOfBusiness;
            user.bankName = req.body.bankName || user.bankName;
            user.accountNumber = req.body.accountNumber || user.accountNumber;
            user.ifscCode = req.body.ifscCode || user.ifscCode;
            user.accountHolderName = req.body.accountHolderName || user.accountHolderName;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
                companyName: updatedUser.companyName,
                phoneNumber: updatedUser.phoneNumber,
                address: updatedUser.address,
                bankName: updatedUser.bankName,
                accountNumber: updatedUser.accountNumber,
                ifscCode: updatedUser.ifscCode,
                accountHolderName: updatedUser.accountHolderName,
                razorpayAccountId: updatedUser.razorpayAccountId,
                logoURL: updatedUser.logoURL
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const uploadLogo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            user.logoURL = req.file.path;
            const updatedUser = await user.save();
            res.json({
                message: 'Logo uploaded successfully',
                logoURL: updatedUser.logoURL
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Logo upload error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
