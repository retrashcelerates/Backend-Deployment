import pool from '../config/db.js';


export const createUser = async ({ username, email, password, role = 'user', avatar_url = null, address = null, phone = null }) => {
	const q = `INSERT INTO users (username, email, password, role, avatar_url, address, phone) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, username, email, role, avatar_url, address, phone, created_at, updated_at`;
	const values = [username, email, password, role, avatar_url, address, phone];
	const { rows } = await pool.query(q, values);
	return rows[0];
};

export const findUserByEmail = async (email) => {
	const q = `SELECT * FROM users WHERE email=$1`;
	const { rows } = await pool.query(q, [email]);
	return rows[0];
};

export const findUserById = async (id) => {
	const q = `SELECT id, username, email, role, avatar_url, address, phone, created_at, updated_at FROM users WHERE id=$1`;
	const { rows } = await pool.query(q, [id]);
	return rows[0];
};

export const findUserByUsername = async (username) => {
	const q = `SELECT * FROM users WHERE username=$1`;
	const { rows } = await pool.query(q, [username]);
	return rows[0];
};

