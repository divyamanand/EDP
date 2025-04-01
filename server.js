require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express App
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

// API Route to Store Data
app.post('/store-data', async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    if (temperature == null || humidity == null) {
      return res.status(400).json({ error: 'Missing temperature or humidity' });
    }

    const query = 'INSERT INTO sensor_data (temperature, humidity) VALUES ($1, $2) RETURNING *';
    const values = [temperature, humidity];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Data stored successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error storing data' });
  }
});

// API Route to Fetch Stored Data
app.get('/get-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sensor_data ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
