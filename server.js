const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Configure PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sample',
  password: '@Naren2005VB',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload setup
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 5000000 }, // 5MB limit
});

// API route to handle registration
app.post('/api/register', upload.single('profilePhoto'), async (req, res) => {
  const {
    name,
    email,
    password,
    linkedinProfile,
    softwareExpertise,
    levelOfExpertise,
    topicsOfInterest,
  } = req.body;

  const profilePhoto = req.file ? req.file.filename : null;

  try {
    // Start transaction
    const client = await pool.connect();
    await client.query('BEGIN');

    // Insert user data
    const result = await client.query(
      `INSERT INTO users (name, email, password_hash, linkedin_profile, profile_photo, level_of_expertise) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, password, linkedinProfile, profilePhoto, levelOfExpertise]
    );

    const userId = result.rows[0].id;

    // Insert software expertise
    const softwareList = JSON.parse(softwareExpertise);
    for (const software of softwareList) {
      await client.query(
        `INSERT INTO software_expertise (user_id, software_name) VALUES ($1, $2)`,
        [userId, software]
      );
    }

    // Insert topics of interest
    const topicList = JSON.parse(topicsOfInterest);
    for (const topic of topicList) {
      await client.query(
        `INSERT INTO topics_of_interest (user_id, topic_name) VALUES ($1, $2)`,
        [userId, topic]
      );
    }

    // Commit transaction
    await client.query('COMMIT');
    client.release();

    res.status(200).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
