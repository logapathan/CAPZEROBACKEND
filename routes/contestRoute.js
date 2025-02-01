const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); 



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// SQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sample',
    password: '@Naren2005VB',
    port: 5432,
  });
// Routes
router.post('/submitForm', upload.fields([{ name: 'questionImage' }, { name: 'referenceModel' }]), async (req, res) => {
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

  
  

  if (Object.keys(newErrors).length > 0) {
    return res.status(400).json({ errors: newErrors });
  }

  
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
    console.error('Error inserting data:', err);
    //error hadiling
            deleteFile(questionImage);
            deleteFile(referenceModel);

            res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
