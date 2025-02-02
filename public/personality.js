// Update progress bar and value indicators for sliders
document.querySelectorAll('input[type="range"]').forEach(slider => {
    const valueIndicator = slider.parentElement.querySelector('.value-indicator');
    
    slider.addEventListener('input', function() {
        valueIndicator.textContent = this.value;
        valueIndicator.style.left = `${(this.value - this.min) * 100 / (this.max - this.min)}%`;
        updateProgress();
    });
});

function updateProgress() {
    const totalQuestions = 5;
    const answeredQuestions = Array.from(document.querySelectorAll('input[type="range"]'))
        .filter(input => input.value !== '5').length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

function calculateMBTI() {
    const values = [];
    for (let i = 1; i <= 5; i++) {
        values.push(parseInt(document.getElementById(`question${i}`).value));
    }

    // Calculate MBTI dimensions
    const extraversion = values[0] > 5 ? 'E' : 'I';
    const intuition = values[1] > 5 ? 'N' : 'S';
    const thinking = values[2] > values[3] ? 'T' : 'F';
    const judging = values[4] > 5 ? 'J' : 'P';

    const mbtiType = extraversion + intuition + thinking + judging;
    
    // Show results with animation
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.add('visible');

    // Update personality type with animation
    const personalityOutput = document.getElementById('personalityOutput');
    personalityOutput.innerHTML = `${mbtiType}`;
    
    // Get and display characteristics and recommendations
    const { characteristics, recommendation } = getPersonalityDetails(mbtiType);
    
    document.getElementById('keyCharacteristics').innerHTML = `
        <h3>Key Characteristics</h3>
        <p>${characteristics}</p>
    `;
    
    document.getElementById('recommendation').innerHTML = `
        <h3>Personal Growth Recommendation</h3>
        <p>${recommendation}</p>
    `;
}

function getPersonalityDetails(type) {
    const personalities = {
        'ENTJ': {
            characteristics: 'Natural leaders with a strong drive for achievement. Strategic thinkers who excel at organizing people and resources to achieve long-term goals.',
            recommendation: 'Practice active listening and emotional intelligence to better connect with team members. Consider the human element in your decisive leadership style.'
        },
        // Add other personality types here...
    };

    // Default response if type not found
    return personalities[type] || {
        characteristics: 'Unique combination of personality traits',
        recommendation: 'Focus on self-awareness and personal growth while embracing your natural tendencies.'
    };
}