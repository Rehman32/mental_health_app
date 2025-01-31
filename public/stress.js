//stress.js
function calculateStress() {
    const workload = parseInt(document.getElementById('workload').value);
    const relationships = parseInt(document.getElementById('relationships').value);
    const health = parseInt(document.getElementById('health').value);
    const finances = parseInt(document.getElementById('finances').value);

    if (isNaN(workload) || isNaN(relationships) || isNaN(health) || isNaN(finances)) {
        alert('Please enter numerical values for stress factors.');
        return;
    }

    const stressScore = calculateStressScore(workload, relationships, health, finances);
    displayStressResult(stressScore);
}

function calculateStressScore(workload, relationships, health, finances) {
    // You can customize the formula based on your criteria
    // This is a simple example, you might need a more complex formula
    const stressScore = (workload + relationships + health + finances) / 4;
    return stressScore.toFixed(2);
}

function displayStressResult(stressScore) {
    const stressResultSection = document.getElementById('stressResultSection');
    const stressCategory = getStressCategory(stressScore);
    const stressAdvice = getStressAdvice(stressCategory);

    stressResultSection.innerHTML = `<h2>Your Stress Score: ${stressScore}</h2>
                                     <p>Category: ${stressCategory}</p>
                                     <p>${stressAdvice}</p>`;
}

function getStressCategory(stressScore) {
    if (stressScore < 4) {
        return 'Low Stress';
    } else if (stressScore >= 4 && stressScore < 7) {
        return 'Moderate Stress';
    } else {
        return 'High Stress';
    }
}

function getStressAdvice(category) {
    switch (category) {
        case 'Low Stress':
            return 'Congratulations! Your stress levels are low. Keep practicing healthy habits for stress management.';
        case 'Moderate Stress':
            return 'Consider incorporating stress management techniques such as deep breathing, meditation, or regular breaks.';
        case 'High Stress':
            return 'It is crucial to address high stress levels. Seek support from friends, family, or a mental health professional. Implement stress-reduction strategies and consider a healthy work-life balance.';
        default:
            return '';
    }
}
function goToDashboard() {
    // Replace 'dashboard.html' with the actual file or route for your dashboard
    window.location.href = 'dashboard.html';
}
