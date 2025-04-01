const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "edp",
    password: "7698",  // Ensure password is a string
    port: 5432 // Ensure port is a number
});

async function fetchAndStoreSensorData() {
    try {
        const response = await fetch('http://192.168.245.142/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res = await response.json();
        const query = 'INSERT INTO sensor_data (ir, red, bpm, avgbpm) VALUES ($1, $2, $3, $4) RETURNING *'; 
        const values = [res.ir, res.red, res.bpm, res.avgBpm];
        
        const result = await pool.query(query, values);
        console.log('Data inserted:', result.rows[0]);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

setInterval(fetchAndStoreSensorData, 100);