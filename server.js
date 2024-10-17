// server.js

const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Configure the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the database connection
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Example API endpoint to fetch data from the database
app.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch patients' });
        }
        res.json(results);
    });
});

// Example API endpoint to add a new patient
app.post('/patients', (req, res) => {
    const { name, age, condition } = req.body;
    db.query('INSERT INTO patients (name, age, condition) VALUES (?, ?, ?)', [name, age, condition], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add patient' });
        }
        res.status(201).json({ id: results.insertId, name, age, condition });
    });
});

// Example API endpoint to update a patient
app.put('/patients/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, condition } = req.body;
    db.query('UPDATE patients SET name = ?, age = ?, condition = ? WHERE id = ?', [name, age, condition, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update patient' });
        }
        res.json({ id, name, age, condition });
    });
});

// Example API endpoint to delete a patient
app.delete('/patients/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM patients WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete patient' });
        }
        res.json({ message: 'Patient deleted successfully' });
    });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
