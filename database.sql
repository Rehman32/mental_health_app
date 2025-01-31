-- Create the database
CREATE DATABASE IF NOT EXISTS mental_health_app;
USE mental_health_app;

-- Users Table
CREATE TABLE USERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
select * from USERS;

-- BMI Records Table
CREATE TABLE bmi_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bmi DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Emotion Analysis Table
CREATE TABLE emotion_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    selected_emoji VARCHAR(50) NOT NULL,
    additional_message TEXT,
    analysis_result TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Depression Assessment Table
CREATE TABLE depression_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question1_answer INT NOT NULL,
    question2_answer INT NOT NULL,
    question3_answer INT NOT NULL,
    total_score INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Stress Measurement Table
CREATE TABLE stress_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workload INT NOT NULL,
    relationships INT NOT NULL,
    health INT NOT NULL,
    finances INT NOT NULL,
    stress_score DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- Personality Weighted Model Table
CREATE TABLE personality_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    extroversion INT NOT NULL,
    conscientiousness INT NOT NULL,
    openness INT NOT NULL,
    agreeableness INT NOT NULL,
    emotional_stability INT NOT NULL,
    creativity INT NOT NULL,
    adventurousness INT NOT NULL,
    empathy INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);
