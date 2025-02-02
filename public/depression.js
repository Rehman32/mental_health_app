// Questions based on PHQ-9 and GAD-7 scales
const assessmentQuestions = [
    {
        id: 1,
        text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "mood"
    },
    {
        id: 2,
        text: "How often have you had little interest or pleasure in doing things?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "interest"
    },
    {
        id: 3,
        text: "How often have you had trouble falling or staying asleep, or sleeping too much?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "sleep"
    },
    {
        id: 4,
        text: "How often have you felt tired or had little energy?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "energy"
    },
    {
        id: 5,
        text: "How often have you had poor appetite or been overeating?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "appetite"
    },
    {
        id: 6,
        text: "How often have you felt bad about yourself or that you are a failure?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "self-worth"
    },
    {
        id: 7,
        text: "How often have you had trouble concentrating on things?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "concentration"
    },
    {
        id: 8,
        text: "How often have you felt nervous, anxious, or on edge?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "anxiety"
    },
    {
        id: 9,
        text: "How often have you not been able to stop or control worrying?",
        options: [
            { value: 0, text: "Not at all" },
            { value: 1, text: "Several days" },
            { value: 2, text: "More than half the days" },
            { value: 3, text: "Nearly every day" }
        ],
        category: "worry"
    },
    {
        id: 10,
        text: "If you've had any of these problems, how difficult have they made it to do your work, take care of things at home, or get along with other people?",
        options: [
            { value: 0, text: "Not difficult at all" },
            { value: 1, text: "Somewhat difficult" },
            { value: 2, text: "Very difficult" },
            { value: 3, text: "Extremely difficult" }
        ],
        category: "functioning"
    }
];

// Global state
let currentQuestionIndex = 0;
let userResponses = new Array(assessmentQuestions.length).fill(null);
let assessmentStartTime = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init();

    // Get DOM elements
    const startButton = document.getElementById('startAssessment');
    const introSection = document.getElementById('introSection');
    const assessmentForm = document.getElementById('assessmentForm');
    const questionContainer = document.getElementById('questionContainer');
    const prevButton = document.getElementById('prevQuestion');
    const nextButton = document.getElementById('nextQuestion');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const timeRemaining = document.getElementById('timeRemaining');
    const resultSection = document.getElementById('resultSection');

    // Event Listeners
    startButton.addEventListener('click', startAssessment);
    prevButton.addEventListener('click', showPreviousQuestion);
    nextButton.addEventListener('click', handleNextQuestion);

    // Start Assessment
    function startAssessment() {
        assessmentStartTime = new Date();
        introSection.classList.add('hidden');
        assessmentForm.classList.remove('hidden');
        showQuestion(0);
        updateProgress();
    }

    // Display Question
    function showQuestion(index) {
        const question = assessmentQuestions[index];
        questionContainer.innerHTML = `
            <div class="question-item" data-aos="fade-right">
                <p class="question-text">${question.text}</p>
                <div class="options-grid">
                    ${question.options.map((option, optIndex) => `
                        <div class="option-card ${userResponses[index] === option.value ? 'selected' : ''}"
                             onclick="selectOption(${index}, ${option.value}, this)">
                            ${option.text}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Update navigation buttons
        prevButton.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextButton.textContent = index === assessmentQuestions.length - 1 ? 'Submit' : 'Next';
        
        document.getElementById('currentQuestion').textContent = index + 1;
        document.getElementById('totalQuestions').textContent = assessmentQuestions.length;
    }

    // Handle Option Selection
    window.selectOption = function(questionIndex, value, element) {
        userResponses[questionIndex] = value;
        const options = questionContainer.querySelectorAll('.option-card');
        options.forEach(option => option.classList.remove('selected'));
        element.classList.add('selected');
        updateProgress();
    }

    // Navigation Functions
    function showPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
            updateProgress();
        }
    }

    function handleNextQuestion() {
        if (userResponses[currentQuestionIndex] === null) {
            alert('Please select an option before proceeding.');
            return;
        }

        if (currentQuestionIndex < assessmentQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            submitAssessment();
        }
        updateProgress();
    }

    // Progress Updates
    function updateProgress() {
        const answered = userResponses.filter(response => response !== null).length;
        const progress = (answered / assessmentQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = Math.round(progress);
        
        // Update estimated time
        const timeElapsed = new Date() - assessmentStartTime;
        const avgTimePerQuestion = timeElapsed / (currentQuestionIndex + 1);
        const questionsRemaining = assessmentQuestions.length - (currentQuestionIndex + 1);
        const estimatedTimeRemaining = Math.ceil((questionsRemaining * avgTimePerQuestion) / 60000);
        timeRemaining.textContent = Math.max(1, estimatedTimeRemaining);
    }

    // Submit Assessment
    function submitAssessment() {
        const results = calculateResults();
        displayResults(results);
        assessmentForm.classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        // Show support modal for severe cases
        if (results.severity === 'Severe') {
            document.getElementById('supportModal').classList.add('active');
        }
    }

    // Calculate Results
    function calculateResults() {
        const totalScore = userResponses.reduce((sum, value) => sum + value, 0);
        const maxPossibleScore = assessmentQuestions.length * 3;
        const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);

        // Calculate category scores
        const categoryScores = {};
        assessmentQuestions.forEach((question, index) => {
            if (!categoryScores[question.category]) {
                categoryScores[question.category] = [];
            }
            categoryScores[question.category].push(userResponses[index]);
        });

        // Average each category
        Object.keys(categoryScores).forEach(category => {
            const scores = categoryScores[category];
            categoryScores[category] = Math.round((scores.reduce((a, b) => a + b) / scores.length) * 33.33);
        });

        // Determine severity
        let severity;
        if (normalizedScore < 25) severity = 'Minimal';
        else if (normalizedScore < 50) severity = 'Mild';
        else if (normalizedScore < 75) severity = 'Moderate';
        else severity = 'Severe';

        return {
            totalScore: normalizedScore,
            categoryScores,
            severity,
            completionDate: new Date().toLocaleDateString()
        };
    }

    // Display Results
    function displayResults(results) {
        // Update main score
        document.getElementById('mainScore').textContent = results.totalScore;
        document.getElementById('severityLabel').textContent = results.severity;
        document.getElementById('completionDate').textContent = results.completionDate;

        // Update category breakdown
        const categoryScoresContainer = document.getElementById('categoryScores');
        categoryScoresContainer.innerHTML = Object.entries(results.categoryScores)
            .map(([category, score]) => `
                <div class="category-score">
                    <div class="category-label">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${score}%"></div>
                        <span class="score-value">${score}%</span>
                    </div>
                </div>
            `).join('');

        // Create trends chart
        const trendsChart = new Chart(document.getElementById('trendsChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Previous', 'Current'],
                datasets: [{
                    label: 'Assessment Score',
                    data: [0, results.totalScore],
                    borderColor: '#2563eb',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        // Generate recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        const recommendations = generateRecommendations(results);
        recommendationsList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <i class="${rec.icon}"></i>
                <div class="recommendation-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Generate Recommendations
    function generateRecommendations(results) {
        const recommendations = [];
        
        if (results.severity === 'Severe' || results.severity === 'Moderate') {
            recommendations.push({
                icon: 'fas fa-user-md',
                title: 'Seek Professional Help',
                description: 'Consider scheduling an appointment with a mental health professional for a full evaluation.'
            });
        }

        recommendations.push({
            icon: 'fas fa-heart',
            title: 'Self-Care Activities',
            description: 'Engage in regular exercise, maintain a healthy sleep schedule, and practice relaxation techniques.'
        });

        if (results.categoryScores.sleep > 50) {
            recommendations.push({
                icon: 'fas fa-moon',
                title: 'Sleep Hygiene',
                description: 'Establish a consistent sleep schedule and create a relaxing bedtime routine.'
            });
        }

        if (results.categoryScores.anxiety > 50) {
            recommendations.push({
                icon: 'fas fa-leaf',
                title: 'Stress Management',
                description: 'Try meditation, deep breathing exercises, or mindfulness practices to reduce anxiety.'
            });
        }

        return recommendations;
    }

    // Modal Controls
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('supportModal').classList.remove('active');
    });

    // Download Report
    document.getElementById('downloadReport').addEventListener('click', () => {
        // Implementation for downloading PDF report
        alert('Report download functionality will be implemented here');
    });

    // Schedule Consultation
    document.getElementById('scheduleConsultation').addEventListener('click', () => {
        // Implementation for consultation scheduling
        alert('Consultation scheduling functionality will be implemented here');
    });

    // View Resources
    document.getElementById('viewResources').addEventListener('click', () => {
        // Implementation for viewing additional resources
        alert('Resources viewing functionality will be implemented here');
    });
    // ... (previous JavaScript code remains the same until the submitAssessment function) ...

// Submit Assessment
function submitAssessment() {
    // Calculate results
    const results = calculateResults();
    
    // Display results
    displayResults(results);
    
    // Hide assessment form and show results
    assessmentForm.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // Update navigation to show we're done
    document.querySelector('.progress-wrapper').style.display = 'none';
    
    // Show support modal for severe cases
    if (results.severity === 'Severe' || results.severity === 'Moderate') {
        setTimeout(() => {
            document.getElementById('supportModal').classList.add('active');
        }, 1000);
    }
    
    // Save results to localStorage
    saveAssessmentResults(results);
}

// Save assessment results
function saveAssessmentResults(results) {
    const previousAssessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    previousAssessments.push({
        ...results,
        date: new Date().toISOString()
    });
    localStorage.setItem('assessmentHistory', JSON.stringify(previousAssessments));
}

// Enhanced results display
function displayResults(results) {
    // Update main score with animation
    const mainScore = document.getElementById('mainScore');
    const targetScore = results.totalScore;
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
        if (currentScore >= targetScore) {
            clearInterval(scoreInterval);
            mainScore.textContent = targetScore;
        } else {
            currentScore += 1;
            mainScore.textContent = currentScore;
        }
    }, 20);

    // Update severity label with appropriate color
    const severityLabel = document.getElementById('severityLabel');
    severityLabel.textContent = results.severity;
    severityLabel.className = `severity-label severity-${results.severity.toLowerCase()}`;

    // Update completion date
    document.getElementById('completionDate').textContent = new Date().toLocaleDateString();

    // Update category breakdown with animations
    const categoryScoresContainer = document.getElementById('categoryScores');
    categoryScoresContainer.innerHTML = Object.entries(results.categoryScores)
        .map(([category, score]) => `
            <div class="category-score" data-aos="fade-right">
                <div class="category-label">
                    <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span>${score}%</span>
                </div>
                <div class="score-bar">
                    <div class="score-fill" style="width: 0%"></div>
                </div>
            </div>
        `).join('');

    // Animate score bars
    setTimeout(() => {
        document.querySelectorAll('.score-fill').forEach((fill, index) => {
            const score = Object.values(results.categoryScores)[index];
            fill.style.width = `${score}%`;
        });
    }, 100);

    // Create trends chart
    const previousAssessments = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    const trendsData = previousAssessments.map(assessment => assessment.totalScore);
    trendsData.push(results.totalScore);

    const trendsChart = new Chart(document.getElementById('trendsChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: trendsData.map((_, index) => `Assessment ${index + 1}`),
            datasets: [{
                label: 'Assessment Score',
                data: trendsData,
                borderColor: '#2563eb',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Generate and display recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    const recommendations = generateRecommendations(results);
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item" data-aos="fade-up">
            <i class="${rec.icon}"></i>
            <div class="recommendation-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        </div>
    `).join('');

    // Initialize download functionality
    initializeDownload(results);
}

// Initialize download functionality
function initializeDownload(results) {
    document.getElementById('downloadReport').addEventListener('click', () => {
        const reportContent = generateReportContent(results);
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assessment-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

// Generate report content
function generateReportContent(results) {
    return `Mental Wellness Assessment Report
Date: ${new Date().toLocaleDateString()}

Overall Score: ${results.totalScore}%
Severity Level: ${results.severity}

Category Breakdown:
${Object.entries(results.categoryScores)
    .map(([category, score]) => `${category}: ${score}%`)
    .join('\n')}

Recommendations:
${generateRecommendations(results)
    .map(rec => `- ${rec.title}: ${rec.description}`)
    .join('\n')}

Note: This is a screening tool only. Please consult a mental health professional for proper diagnosis and treatment.`;
}

// ... (rest of the JavaScript code remains the same)
});
