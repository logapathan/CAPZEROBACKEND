const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); 

const app = express();
const port = 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// Set up file storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Set up PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sample',
    password: '@Naren2005VB',
    port: 5432,
  });
// Route to handle form submission
app.post('/submitForm', upload.fields([{ name: 'questionImage' }, { name: 'referenceModel' }]), async (req, res) => {
  const {
    id,
    title,
    category,
    type,
    problemStatement,
    constraint,
    constraintValue,
    material,
    startDate,
    startTime,
    duration,
    access,
    participanttype,
    maxParticipants,
    softwareRequired,
    description,
  } = req.body;

  const questionImage = req.files['questionImage'] ? req.files['questionImage'][0].path : null;
  const referenceModel = req.files['referenceModel'] ? req.files['referenceModel'][0].path : null;

  let newErrors = {};

  // Validation based on contest type
  

  if (Object.keys(newErrors).length > 0) {
    return res.status(400).json({ errors: newErrors });
  }

  // Insert the common contest data into the `contests` table
  const query = `
    INSERT INTO contests 
    (title, category, type, startDate, startTime, duration, access, participanttype, maxParticipants, softwareRequired, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
  `;
  const values = [
    title,
    category,
    type,
    startDate,
    startTime,
    duration,
    access,
    participanttype,
    maxParticipants,
    softwareRequired,
    description,
  ];

  try {
    const result = await pool.query(query, values);
    const contestId = result.rows[0].id;

    // Now insert type-specific data based on the contest type
    if (type === 'creative') {
      const creativeQuery = `
        INSERT INTO creative_contests (contest_id, problemStatement)
        VALUES ($1, $2)
      `;
      await pool.query(creativeQuery, [contestId, problemStatement]);
    } else if (type === 'race') {
      const raceQuery = `
        INSERT INTO race_contests (contest_id, constraint_type, constraintValue, material, questionImage, referenceModel)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await pool.query(raceQuery, [contestId, constraint, constraintValue, material, questionImage, referenceModel]);
    }

    res.status(200).json({ message: 'Form data submitted successfully' });
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
