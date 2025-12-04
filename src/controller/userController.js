import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../models/userModel.js';
import { createUser, findUserByEmail, findUserByUsername, findUserById as findUserByIdAuth } from '../models/authModel.js';
import bcrypt from 'bcryptjs';
import {
  validatePassword,
  validateEmail,
  validateUsername,
  validatePhone,
  validateAddress,
  validateRole,
  validateId,
  combineErrors,
  formatErrorResponse,
} from '../utils/validator.js';

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({
      message: 'Daftar user berhasil diambil',
      count: users.length,
      data: users,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Detail user gagal: ID tidak valid'));
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json(
        formatErrorResponse([`User dengan ID ${id} tidak ditemukan di sistem`], 'User tidak ditemukan')
      );
    }
    return res.json({
      message: 'Detail user berhasil diambil',
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, address, phone } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Update user gagal: ID tidak valid'));
    }

    const userExists = await getUserById(id);
    if (!userExists) {
      return res.status(404).json(
        formatErrorResponse([`User dengan ID ${id} tidak ditemukan di sistem`], 'User tidak ditemukan')
      );
    }

    const errors = [];

    if (email !== undefined && email !== userExists.email) {
      const emailValidationErrors = validateEmail(email);
      errors.push(...emailValidationErrors);

      const emailExists = await findUserByEmail(email);
      if (emailExists) {
        errors.push(`Email '${email}' sudah digunakan oleh pengguna lain`);
      }
    }

    if (username !== undefined && username !== userExists.username) {
      const usernameValidationErrors = validateUsername(username);
      errors.push(...usernameValidationErrors);

      const usernameExists = await findUserByUsername(username);
      if (usernameExists) {
        errors.push(`Username '${username}' sudah digunakan oleh pengguna lain`);
      }
    }

    if (role !== undefined) {
      const roleErrors = validateRole(role);
      errors.push(...roleErrors);
    }

    if (phone !== undefined && phone !== null) {
      const phoneErrors = validatePhone(phone);
      errors.push(...phoneErrors);
    }

    if (address !== undefined && address !== null) {
      const addressErrors = validateAddress(address);
      errors.push(...addressErrors);
    }

    if (errors.length > 0) {
      return res.status(400).json(formatErrorResponse(errors, 'Update user gagal: Data tidak valid'));
    }

    const avatar_url = req.fileUrl ?? (req.body.avatar_url !== undefined ? req.body.avatar_url : undefined);

    const updatePayload = {};
    if (username !== undefined) updatePayload.username = username;
    if (email !== undefined) updatePayload.email = email;
    if (role !== undefined) updatePayload.role = role;
    if (address !== undefined) updatePayload.address = address;
    if (phone !== undefined) updatePayload.phone = phone;
    if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json(
        formatErrorResponse(['Tidak ada data yang diubah'], 'Tidak ada perubahan data')
      );
    }

    const user = await updateUserById(id, updatePayload);
    return res.json({
      message: 'User berhasil diperbarui',
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Hapus user gagal: ID tidak valid'));
    }

    const result = await deleteUserById(id);
    if (!result) {
      return res.status(404).json(
        formatErrorResponse([`User dengan ID ${id} tidak ditemukan di sistem`], 'User tidak ditemukan')
      );
    }
    return res.json({
      message: 'User berhasil dihapus',
      data: { deletedId: result.id },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const createUserAdmin = async (req, res) => {
  try {
    const { username, email, password, role = 'user', avatar_url = null, address = null, phone = null } = req.body;

    const usernameErrors = validateUsername(username);
    const emailErrors = validateEmail(email);
    const passwordErrors = validatePassword(password);
    const roleErrors = validateRole(role);
    const phoneErrors = validatePhone(phone);
    const addressErrors = validateAddress(address);

    const allErrors = combineErrors(usernameErrors, emailErrors, passwordErrors, roleErrors, phoneErrors, addressErrors);

    if (allErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(allErrors, 'Buat user gagal: Data tidak valid'));
    }

    const emailExists = await findUserByEmail(email);
    if (emailExists) {
      return res.status(409).json(
        formatErrorResponse([`Email '${email}' sudah terdaftar di sistem`], 'Email sudah digunakan')
      );
    }

    const usernameExists = await findUserByUsername(username);
    if (usernameExists) {
      return res.status(409).json(
        formatErrorResponse([`Username '${username}' sudah digunakan oleh pengguna lain`], 'Username sudah terdaftar')
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ username, email, password: hashed, role, avatar_url, address, phone });
    return res.status(201).json({
      message: 'User berhasil dibuat oleh admin',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json(
        formatErrorResponse(['Email atau username sudah terdaftar di sistem'], 'Data duplikat')
      );
    }
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export default { getUsers, getUserDetail, updateUser, deleteUser, createUserAdmin };
