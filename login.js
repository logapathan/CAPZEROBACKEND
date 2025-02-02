import env from "dotenv";
import express from "express";
import client from "pg";
import bcrypt from "bcryptjs";
import bodyparser from "body-parser";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import multer from "multer";
const port = 3000;
env.config();
const s3 = new S3Client({
  region: process.env.AWS_REGION, // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__filename);
// console.log(__dirname);

const app = express();
app.use(express.json());
// app.use(bodyparser.json());
// app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

const storage = multer.memoryStorage(); // Store file in memory before uploading
const upload = multer({ storage });

app.post("/register", upload.single("profilePhoto"), async (req, res) => {
  const { name, email, password, linkedinProfile } = req.body;
  const softwareExpertise = JSON.parse(req.body.softwareExpertise);
  const topicsOfInterest = JSON.parse(req.body.topicsOfInterest);

  const software = {
    SolidWorks: 1,
    ANSYS: 2,
    CATIA: 3,
    AutoCAD: 4,
    "Fusion 360": 5,
    Inventor: 6,
    MATLAB: 7,
  };
  const topicofoptions = {
    Design: 1,
    FEM: 2,
    CFD: 3,
    CAM: 4,
    "Additive Manufacturing": 5,
    Simulation: 6,
    "Product Development": 7,
  };

  const userquery = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [name]
  );
  const emailquery = await pool.query(
    "SELECT email FROM users WHERE email=$1",
    [email]
  );

  if (userquery.rows.length > 0) {
    return res.json({ message: "User already exists", pass: false });
  } else if (emailquery.rows.length > 0) {
    return res.json({ message: "Email alreay exists", pass: false });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 15);
    await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3)",
      [name, email, hashedPassword]
    );
    const id = await pool.query("SELECT id FROM users WHERE username=$1", [
      name,
    ]);

    //profile picture storage using aws bucket
    const fileKey = `${Date.now()}-${path.basename(req.file.originalname)}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `ProfilePhoto/${fileKey}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read", // Set appropriate ACL (e.g., public-read or private)
    };

    const data = await s3.send(new PutObjectCommand(params));
    // res.json({
    //   uploadstatus: true,
    // });

    // console.log("Profile photo uploaded successfully:", data);
    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/ProfilePhoto/${fileKey}`;
    console.log(fileUrl);
    // await pool.query(
    //   `INSERT INTO "UserProfilePhoto" ("UserID","URL") SELECT id,$1 FROM users WHERE username=$2`,
    //   fileUrl,
    //   name
    // );
  } catch (error) {
    console.log("fileupload");
    console.log(error);
    return res.json({
      uploadstatus: false,
    });
  }

  for (let i = 0; i < softwareExpertise.length; i++) {
    try {
      await pool.query(
        `INSERT INTO "SoftwareExpertise" ("UserID","SoftwareID") SELECT id,$1 FROM users WHERE username=$2 `,
        [software[softwareExpertise[i]], name]
      );
    } catch (error) {
      // res.json({ messgae: "Error in inserting software values" });
      console.log("software");
      console.log(error);
    }
  }
  for (let i = 0; i < topicsOfInterest.length; i++) {
    // console.log(topicofoptions[topicsOfInterest[i]]);
    try {
      await pool.query(
        `INSERT INTO "TopicOfInterest" ("UserID","TopicID") SELECT id,$1 FROM users WHERE username=$2`,
        [topicofoptions[topicsOfInterest[i]], name]
      );
    } catch (error) {
      res.json({ messgae: "Error in inserting topic values" });
      // console.log("topic");
      // console.log(error);
    }
  }

  return res.json({ messgae: "user registered sussfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userquery = await pool.query("SELECT * FROM users WHERE email=$1 ", [
    email,
  ]);

  const user = userquery.rows[0];

  if (!user) {
    return res.json({
      message: "Invalid credentials. Try Again.",
      pass: false,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    return res.json({
      message: "Invalid credentials. Try Again.",
      pass: false,
    });
  }

  res.json({ message: "Login successful", pass: true });
});
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
