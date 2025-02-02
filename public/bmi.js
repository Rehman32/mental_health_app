document.addEventListener("DOMContentLoaded",function(){
    
AOS.init({
    duration: 800,
    once: true
});

function calculateBMI() {
    const feet = parseFloat(document.getElementById('feet').value);
    const inches = parseFloat(document.getElementById('inches').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (!feet || !inches || !weight) {
        alert('Please fill in all fields');
        return;
    }

    const heightInCm = (feet * 30.48) + (inches * 2.54);
    const heightInMeters = heightInCm / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    displayResult(bmi);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function displayResult(bmi) {
    const resultSection = document.getElementById('resultSection');
    const category = getBMICategory(bmi);
    
    resultSection.innerHTML = `
        <div class="bmi-score">${bmi}</div>
        <div class="bmi-category">${category}</div>
        <div class="health-advice">
            <h4>Health Recommendations:</h4>
            <ul>
                ${getHealthAdvice(category)}
            </ul>
        </div>
    `;
    
    resultSection.classList.add('active');
}

function getHealthAdvice(category) {
    const advice = {
        'Underweight': [
            'Consult with a healthcare provider',
            'Increase caloric intake with nutrient-rich foods',
            'Include protein-rich foods in your diet',
            'Consider strength training exercises'
        ],
        'Healthy Weight': [
            'Maintain your balanced diet',
            'Continue regular physical activity',
            'Monitor your BMI periodically',
            'Focus on overall wellness'
        ],
        'Overweight': [
            'Incorporate more physical activity',
            'Focus on portion control',
            'Choose whole, unprocessed foods',
            'Consider consulting a nutritionist'
        ],
        'Obese': [
            'Consult with healthcare professionals',
            'Develop a structured weight loss plan',
            'Start with low-impact exercises',
            'Monitor other health markers'
        ]
    };

    return advice[category].map(item => `<li>${item}</li>`).join('');
}
})
