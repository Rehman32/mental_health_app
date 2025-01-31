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

// Route to handle BMI records
app.post('/bmi', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const { height, weight } = req.body;

    if (!height || !weight) {
        return res.status(400).send('Height and weight are required.');
    }

    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);

    // Save BMI record to the database
    db.query('INSERT INTO bmi_records (user_id, bmi) VALUES (?, ?)', [userId, bmi], (err) => {
        if (err) {
            console.error('Error inserting BMI record into the database:', err);
            return res.status(500).send('Error occurred while saving BMI record.');
        }

        res.status(200).send(`BMI record saved successfully! <a href="/dashboard">Go back to dashboard</a>`);
    });
});

// ... (previous code)

// Route to handle Emotion Analysis records
app.post('/emotion', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const selectedEmoji = req.body.selectedEmoji; // Updated variable name
    const additionalMessage = req.body.additionalMessage; // Updated variable name
    const analysisResult = req.body.analysisResult; // Updated variable name

    // Save Emotion Analysis record to the database
    db.query('INSERT INTO emotion_records (user_id, selected_emoji, additional_message, analysis_result) VALUES (?, ?, ?, ?)', 
        [userId, selectedEmoji, additionalMessage, analysisResult], (err) => {
            if (err) {
                console.error('Error inserting Emotion Analysis record into the database:', err);
                return res.status(500).send('Error occurred while saving Emotion Analysis record.');
            }

            res.status(200).send(`Emotion Analysis record saved successfully! <a href="/dashboard">Go back to dashboard</a>`);
        });
});

// Route to handle Depression Assessment records
app.post('/depression', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const answers = req.body;

    // Convert answers object to an array of scores
    const scores = Object.values(answers).map(answer => parseInt(answer));

    // Calculate the total score
    const totalScore = scores.reduce((sum, score) => sum + score, 0);

    // Save Depression Assessment record to the database
    db.query('INSERT INTO depression_records (user_id, question1_answer, question2_answer, question3_answer, total_score) VALUES (?, ?, ?, ?, ?)', 
        [userId, answers.question1, answers.question2, answers.question3, totalScore], (err) => {
            if (err) {
                console.error('Error inserting Depression Assessment record into the database:', err);
                return res.status(500).send('Error occurred while saving Depression Assessment record.');
            }

            res.status(200).send(`Depression Assessment record saved successfully! <a href="/dashboard">Go back to dashboard</a>`);
        });
});

// Route to handle Stress Measurement records
app.post('/stress', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const workload = parseInt(req.body.workload);
    const relationships = parseInt(req.body.relationships);
    const health = parseInt(req.body.health);
    const finances = parseInt(req.body.finances);

    // Validate input data
    if (isNaN(workload) || isNaN(relationships) || isNaN(health) || isNaN(finances)) {
        return res.status(400).send('Please enter numerical values for stress factors.');
    }

    // Calculate the stress score
    const stressScore = (workload + relationships + health + finances) / 4;

    // Save Stress Measurement record to the database
    db.query('INSERT INTO stress_records (user_id, workload, relationships, health, finances, stress_score) VALUES (?, ?, ?, ?, ?, ?)', 
        [userId, workload, relationships, health, finances, stressScore], (err) => {
            if (err) {
                console.error('Error inserting Stress Measurement record into the database:', err);
                return res.status(500).send('Error occurred while saving Stress Measurement record.');
            }

            res.status(200).send(`Stress Measurement record saved successfully! <a href="/dashboard">Go back to dashboard</a>`);
        });
});

// Route to handle Personality Weighted Model records
app.post('/personality', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const personalityTraits = req.body;

    // Save Personality Weighted Model record to the database
    db.query('INSERT INTO personality_records (user_id, extroversion, conscientiousness, openness, agreeableness, emotional_stability, creativity, adventurousness, empathy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [userId, personalityTraits.extroversion, personalityTraits.conscientiousness, personalityTraits.openness, personalityTraits.agreeableness, personalityTraits.emotionalStability, personalityTraits.creativity, personalityTraits.adventurousness, personalityTraits.empathy], 
        (err) => {
            if (err) {
                console.error('Error inserting Personality Weighted Model record into the database:', err);
                return res.status(500).send('Error occurred while saving Personality Weighted Model record.');
            }

            res.status(200).send(`Personality Weighted Model record saved successfully! <a href="/dashboard">Go back to dashboard</a>`);
        });
});

// ... (remaining code)

// Handle Login
app.post('/login', (req, res) => {
    const { username,email, password } = req.body;

    db.query('SELECT * FROM USERS WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.send('An error occurred. Please try again.');
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare hashed password
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                return res.redirect('/dashboard');
            } else {
                return res.send('Invalid login credentials. <a href="/">Go back to login</a>');
            }
        } else {
            return res.send('Invalid login credentials. <a href="/">Go back to login</a>');
        }
    });
});

// Handle Signup
app.post('/signup', async (req, res) => {
    console.log('Request body:', req.body);
    const { username,email, password } = req.body;

    // Check if password is empty
    if (!password || password.trim() === '') {
        return res.send('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing

    db.query('INSERT INTO USERS (username, email, password) VALUES (?, ?,?)', [username, email, hashedPassword], (err) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.send('An error occurred. Please try again.');
        }
        res.send(`User ${username} signed up successfully! <a href="/">Go back to login</a>`);
    });
});
// Handle Check Username
app.post('/api/check-username', async (req, res) => {
    const { username } = req.body;
  
    db.query('SELECT * FROM USERS WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ available: false });
      }
  
      const available = results.length === 0;
      res.json({ available });
    });
  });
  
 // Handle Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT * FROM USERS WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.json({ error: 'An error occurred' });
      }
  
      if (results.length > 0) {
        const user = results[0];
  
        // Compare hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          req.session.userId = user.id;
          return res.json({ success: true });
        } else {
          return res.json({ error: 'Invalid login credentials' });
        }
      } else {
        return res.json({ error: 'Invalid login credentials' });
      }
    });
  });
  
  // Handle Signup
  app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if username is already taken
    db.query('SELECT * FROM USERS WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.json({ error: 'An error occurred' });
      }
  
      if (results.length > 0) {
        return res.json({ error: 'Username already taken. Please Choose another' });
      }
  
      // Check if email is valid
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.json({ error: 'Invalid email address' });
      }
  
      // Check if password is strong enough
      if (password.length < 8) {
        return res.json({ error: 'Password must be at least 8 characters long' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into database
      db.query('INSERT INTO USERS (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
        if (err) {
          console.error('Error inserting into database:', err);
          return res.json({ error: 'An error occurred' });
        }
  
        return res.json({ success: true });
      });
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

