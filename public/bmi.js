// bmi.js
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
        return 'Overweight';
    } else {
        return 'Obesity';
    }
}

function calculateBMI() {
    const feet = document.getElementById('feet').value;
    const inches = document.getElementById('inches').value;
    const weight = document.getElementById('weight').value;

    if (!feet || !inches || !weight) {
        alert('Please enter all details.');
        return;
    }

    // Convert feet and inches to centimeters
    const heightInCm = (feet * 30.48) + (inches * 2.54);

    // Calculate BMI
    const bmi = (weight / ((heightInCm / 100) * (heightInCm / 100))).toFixed(2);
    
    displayResult(bmi);
}

function displayResult(bmi) {
    const resultSection = document.getElementById('resultSection');
    const bmiCategory = getBMICategory(bmi);
    const message = getMessageForCategory(bmiCategory);
    const healthAdvice = getHealthAdvice(bmiCategory);

    resultSection.innerHTML = `<h2>Your BMI: ${bmi}</h2>
                                <p>Category: ${bmiCategory}</p>
                                <p>${message}</p>
                                <p><strong>Health Advice:</strong> ${healthAdvice}</p>`;
}
function getMessageForCategory(category) {
    // Define messages based on the BMI category
    switch (category) {
        case 'Underweight':
            return 'You are underweight. Consider gaining some weight to reach a healthier BMI.';
        case 'Normal weight':
            return 'Congratulations! Your BMI is in the healthy range. Maintain a balanced diet and regular exercise.';
        case 'Overweight':
            return 'You are overweight. Consider making healthy lifestyle changes, such as a balanced diet and regular physical activity.';
        case 'Obesity':
            return 'You are in the obesity range. Consult with a healthcare professional for guidance on achieving a healthier BMI.';
        default:
            return '';
    }
}


function getHealthAdvice(category) {
    switch (category) {
        case 'Underweight':
            return 'You may need to gain some weight to reach a healthier BMI. Consider consulting with a nutritionist for a balanced diet plan.Diet: Focus on nutrient-dense foods like lean proteins, whole grains, healthy fats, and plenty of fruits and vegetables. Increase your calorie intake through frequent, balanced meals.Exercise: Include strength training exercises to build muscle mass. Compound movements like squats, deadlifts, and bench presses can be beneficial. Cardiovascular exercises can help improve overall fitness.';
            
        case 'Normal weight':
            return  'Congratulations! Your BMI is in the healthy range. Maintain a balanced diet and regular exercise to support overall health.Diet: Maintain a balanced diet with a variety of foods. Ensure you are getting enough vitamins, minerals, and fiber. Portion control is important to avoid overeating.Exercise: Aim for a combination of cardiovascular exercises (e.g., running, cycling) and strength training. Include activities you enjoy to make it sustainable.';

        case 'Overweight':
             return 'Consider making healthy lifestyle changes, such as adopting a balanced diet and engaging in regular physical activity, to reach a healthier BMI. Diet: Focus on a calorie-controlled diet with an emphasis on whole, unprocessed foods. Reduce intake of sugary beverages, and limit the consumption of high-calorie, low-nutrient foods. Exercise: Include a mix of aerobic exercises (e.g., brisk walking, swimming) and strength training. Gradually increase the intensity and duration of your workouts.';
        case 'Obesity':
            return 'It is advisable to consult with a healthcare professional for guidance on achieving a healthier BMI. A personalized plan may include dietary changes, exercise, and medical evaluation. Diet: Adopt a well-balanced, calorie-controlled diet. Consider consulting with a nutritionist for a personalized plan. Limit intake of processed foods, sugars, and saturated fats.Exercise: Engage in regular, moderate-intensity aerobic exercises along with strength training. Incorporate activities that elevate your heart rate and help in burning calories.';
        default:
            return '';
    }
}
function goToDashboard() {
    // Replace 'dashboard.html' with the actual file or route for your dashboard
    window.location.href = 'dashboard.html';
}