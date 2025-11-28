import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, findUserById, findUserByUsername } from '../models/authModel.js';
import { updateUserById } from '../models/userModel.js';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'secret';

export const register = async (req, res) => {
	try {
		const { username, email, password, address = null, phone = null } = req.body;
		if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const existing = await findUserByEmail(email);
		if (existing) return res.status(409).json({ message: 'Email already used' });
		const hashed = await bcrypt.hash(password, 10);
		const user = await createUser({ username, email, password: hashed, address, phone });
		return res.status(201).json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
		const user = await findUserByEmail(email);
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '7d' });
		return res.json({ token });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const getProfile = async (req, res) => {
	try {
		const user = await findUserById(req.user.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { username, email, role, address, phone } = req.body;
		const avatar_url = req.fileUrl ?? (req.body.avatar_url !== undefined ? req.body.avatar_url : undefined);

		const currentUser = await findUserById(req.user.id);
		if (!currentUser) return res.status(404).json({ message: 'User not found' });

		if (email && email !== currentUser.email) {
			const emailExists = await findUserByEmail(email);
			if (emailExists) return res.status(409).json({ message: 'Email already in use' });
		}

		if (username && username !== currentUser.username) {
			const usernameExists = await findUserByUsername(username);
			if (usernameExists) return res.status(409).json({ message: 'Username already in use' });
		}
        
		const updatePayload = {};
		if (username !== undefined) updatePayload.username = username;
		if (email !== undefined) updatePayload.email = email;
		if (role !== undefined) updatePayload.role = role;
		if (address !== undefined) updatePayload.address = address;
		if (phone !== undefined) updatePayload.phone = phone;
		if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url;

		if (Object.keys(updatePayload).length === 0) {
			return res.status(400).json({ message: "No fields provided for update." });
		}

		const user = await updateUserById(req.user.id, updatePayload);

		return res.json({ user });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

export default { register, login, getProfile, updateProfile };
