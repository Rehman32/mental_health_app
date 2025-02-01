// app.js
const express = require('express');
const app = express();
const bcrypt=require('bcrypt');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config()
const bodyParser = require('body-parser');
const session = require('express-session');

const port = 3100;

// For serving static files
app.use(express.static(path.join(__dirname, 'public')));
  
// To parse form data
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// MySQL database configuration
const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
};

// New route for the dashboard

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// New route for the BMI Tracker
app.get('/bmi', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bmi.html'));
});
//api to get bmi file
app.get('/bmi.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'bmi.html'));
});

// New route for the Stress Measurement
app.get('/stress', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stress.html'));
});
// New route for the Stress Measurement
app.get('/stress.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'stress.html'));
});
 
app.get('/emotion',requireLogin, (req,res) => {
    res.sendFile(path.join(__dirname,'views', 'emotion.html'));
});
app.get('/emotion.html', (req,res) => {
    res.sendFile(path.join(__dirname,'views', 'emotion.html'));
});
app.get('/depression',requireLogin, (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'depression.html'));
});
app.get('/depression.html', (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'depression.html'));
});
app.get('/dashboard',requireLogin, (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'dashboard.html'));
});
app.get('/dashboard.html', (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'dashboard.html'));
});
app.get('/login.html',requireLogin, (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'login.html'));
});
app.get('/login', (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'login.html'));
});
app.get('/personality.html',requireLogin, (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'personality.html'));
});
app.get('/personality', (req,res) =>{
    res.sendFile(path.join(__dirname,'views', 'personality.html'));
});

// -------------------- BMI API (Updated) --------------------
app.post('/bmi', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const { height, weight } = req.body;

    if (!height || !weight) {
        return res.status(400).send('Height and weight are required.');
    }

    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);

    // Save BMI record to database
    db.query('INSERT INTO bmi_records (user_id, bmi) VALUES (?, ?)', [userId, bmi], (err) => {
        if (err) {
            console.error('Error inserting BMI record:', err);
            return res.status(500).send('Error saving BMI record.');
        }

        res.status(200).send('BMI record saved successfully!');
    });
});

// Fetch BMI records for user
app.get('/bmi-data', requireLogin, (req, res) => {
    const userId = req.session.userId;
    db.query('SELECT * FROM bmi_records WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching BMI data:', err);
            return res.status(500).send('Error retrieving BMI data.');
        }
        res.json(results);
    });
});

// -------------------- Emotion Analysis API (Updated) --------------------
app.post('/emotion', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const { selectedEmoji, additionalMessage, analysisResult } = req.body;

    db.query('INSERT INTO emotion_records (user_id, selected_emoji, additional_message, analysis_result) VALUES (?, ?, ?, ?)', 
        [userId, selectedEmoji, additionalMessage, analysisResult], (err) => {
            if (err) {
                console.error('Error inserting Emotion record:', err);
                return res.status(500).send('Error saving Emotion record.');
            }
            res.status(200).send('Emotion Analysis record saved successfully!');
        });
});

// Fetch Emotion records for user
app.get('/emotion-data', requireLogin, (req, res) => {
    const userId = req.session.userId;
    db.query('SELECT * FROM emotion_records WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching Emotion data:', err);
            return res.status(500).send('Error retrieving Emotion data.');
        }
        res.json(results);
    });
});

// -------------------- Depression Assessment API (Updated) --------------------
app.post('/depression', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const answers = req.body;
    const scores = Object.values(answers).map(answer => parseInt(answer));
    const totalScore = scores.reduce((sum, score) => sum + score, 0);

    db.query('INSERT INTO depression_records (user_id, question1_answer, question2_answer, question3_answer, total_score) VALUES (?, ?, ?, ?, ?)', 
        [userId, answers.question1, answers.question2, answers.question3, totalScore], (err) => {
            if (err) {
                console.error('Error inserting Depression record:', err);
                return res.status(500).send('Error saving Depression record.');
            }
            res.status(200).send('Depression Assessment record saved successfully!');
        });
});

// Fetch Depression records for user
app.get('/depression-data', requireLogin, (req, res) => {
    const userId = req.session.userId;
    db.query('SELECT * FROM depression_records WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching Depression data:', err);
            return res.status(500).send('Error retrieving Depression data.');
        }
        res.json(results);
    });
});

// -------------------- Stress Measurement API (Updated) --------------------
app.post('/stress', requireLogin, (req, res) => {
    const userId = req.session.userId;
    console.log("User ID:", userId, "Request Data:", req.body);

    if (!userId) {
        return res.status(401).json({ error: "User not logged in" });
    }

    const { workload, relationships, health, finances } = req.body;

    if (![workload, relationships, health, finances].every(val => !isNaN(val))) {
        return res.status(400).json({ error: "All values must be numbers" });
    }

    const stressScore = (parseInt(workload) + parseInt(relationships) + parseInt(health) + parseInt(finances)) / 4;

    db.query(
        'INSERT INTO stress_records (user_id, workload, relationships, health, finances, stress_score) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, workload, relationships, health, finances, stressScore],
        (err) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ message: "Stress record saved successfully" });
        }
    );
});


// Fetch Stress records for user
app.get('/stress-history', requireLogin, (req, res) => {
    const userId = req.session.userId;

    db.query('SELECT * FROM stress_records WHERE user_id = ? ORDER BY recorded_at DESC', [userId], (err, results) => {
        if (err) {
            console.error("Error fetching stress history:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// -------------------- Personality Weighted Model API (Updated) --------------------
app.post('/personality', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const traits = req.body;

    db.query('INSERT INTO personality_records (user_id, extroversion, conscientiousness, openness, agreeableness, emotional_stability, creativity, adventurousness, empathy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, traits.extroversion, traits.conscientiousness, traits.openness, traits.agreeableness, traits.emotionalStability, traits.creativity, traits.adventurousness, traits.empathy], 
        (err) => {
            if (err) {
                console.error('Error inserting Personality record:', err);
                return res.status(500).send('Error saving Personality record.');
            }
            res.status(200).send('Personality record saved successfully!');
        });
});






// API Endpoint: Check if username is available
app.post("/api/check-username", (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.json({ available: false });
    }
    db.query("SELECT id FROM USERS WHERE username = ?", [username], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.json({ available: false });
      }
      const available = results.length === 0;
      res.json({ available });
    });
  });
  
  // API Endpoint: Signup
  app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
  
    // Basic validation (the frontend already validates but always double-check)
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }
  
    // Check if username already exists
    db.query("SELECT id FROM USERS WHERE username = ?", [username], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "An error occurred." });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already taken. Please choose another." });
      }
  
      // Hash the password and insert the new user
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
          "INSERT INTO USERS (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Error inserting into database:", err);
              return res.status(500).json({ error: "An error occurred during signup." });
            }
            // Optionally set session data
            req.session.userId = results.insertId;
            return res.status(200).json({ success: true });
          }
        );
      } catch (error) {
        console.error("Hashing error:", error);
        return res.status(500).json({ error: "An error occurred during signup." });
      }
    });
  });
  
  // API Endpoint: Login
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: "Both username and password are required." });
    }
  
    // Attempt to find the user by username (or email if you extend functionality)
    db.query("SELECT * FROM USERS WHERE username = ?", [username], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "An error occurred." });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid login credentials." });
      }
  
      const user = results[0];
      try {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.userId = user.id;
          return res.status(200).json({ success: true });
        } else {
          return res.status(400).json({ error: "Invalid login credentials." });
        }
      } catch (error) {
        console.error("Bcrypt error:", error);
        return res.status(500).json({ error: "An error occurred." });
      }
    });
  });
  

// Handle Google/Facebook clicks
app.post('/auth/google', (req, res) => {
    res.send('Google login is coming soon.');
});

app.post('/auth/facebook', (req, res) => {
    res.send('Facebook login is coming soon.');
});
// Server listening
app.listen(port, () => {
    console.log(`Server is listening successfully on port ${port}`);
});

