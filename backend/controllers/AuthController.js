import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/User.js';

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required',
                success: false
            });
        }

        // ✅ FIX: Store email lowercase so login always matches
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists, please login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful', success: true });

    } catch (err) {
        // ✅ FIX: Log real error message — previously the catch swallowed it
        // so Render logs showed nothing useful
        console.error('Signup error:', err.message);
        res.status(500).json({
            message: 'Internal server error: ' + err.message,
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                success: false
            });
        }

        // ✅ FIX: Lowercase lookup matches lowercase-stored email
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(403).json({
                message: 'Auth failed: email or password is wrong',
                success: false
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                message: 'Auth failed: email or password is wrong',
                success: false
            });
        }

        // ✅ FIX: Catch missing JWT_SECRET explicitly — this is the #1 cause
        // of 500 errors on Render when environment variables are not set
        if (!process.env.JWT_SECRET) {
            console.error('FATAL: JWT_SECRET environment variable is not set!');
            return res.status(500).json({
                message: 'Server configuration error: JWT_SECRET missing',
                success: false
            });
        }

        const token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            success: true,
            token,
            email: user.email,
            name: user.name,
            _id: user._id
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({
            message: 'Internal server error: ' + err.message,
            success: false
        });
    }
};

export { signup, login };