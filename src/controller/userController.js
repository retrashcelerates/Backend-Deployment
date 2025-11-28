import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../models/userModel.js';
import { createUser, findUserByEmail, findUserByUsername, findUserById as findUserByIdAuth } from '../models/authModel.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, address, phone } = req.body;

    const userExists = await getUserById(id);
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    if (email !== userExists.email) {
      const emailExists = await findUserByEmail(email);
      if (emailExists) return res.status(409).json({ message: 'Email already in use' });
    }

    if (username !== userExists.username) {
      const usernameExists = await findUserByUsername(username);
      if (usernameExists) return res.status(409).json({ message: 'Username already in use' });
    }

    const avatar_url = req.fileUrl ?? (req.body.avatar_url !== undefined ? req.body.avatar_url : undefined);

    const updatePayload = {};
    if (username !== undefined) updatePayload.username = username;
    if (email !== undefined) updatePayload.email = email;
    if (role !== undefined) updatePayload.role = role;
    if (address !== undefined) updatePayload.address = address;
    if (phone !== undefined) updatePayload.phone = phone;
    if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url;

    const user = await updateUserById(id, updatePayload);
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUserById(id);
    if (!result) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted successfully', id: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createUserAdmin = async (req, res) => {
  try {
    const { username, email, password, role = 'user', avatar_url = null, address = null, phone = null } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emailExists = await findUserByEmail(email);
    if (emailExists) return res.status(409).json({ message: 'Email already in use' });
    const usernameExists = await findUserByUsername(username);
    if (usernameExists) return res.status(409).json({ message: 'Username already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ username, email, password: hashed, role, avatar_url, address, phone });
    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ message: 'Duplicate value' });
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { getUsers, getUserDetail, updateUser, deleteUser, createUserAdmin };
