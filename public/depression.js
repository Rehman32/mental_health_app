// depression.js
document.addEventListener('DOMContentLoaded', function () {
    const depressionForm = document.getElementById('depressionForm');
    const resultSection = document.getElementById('resultSection');

    // Questions and their corresponding weights
    const questions = [
        { text: 'How often have you felt down or depressed in the past two weeks?', weight: 2 },
        { text: 'Have you experienced a loss or significant change in your life recently?', weight: 1 },
        { text: 'How is your ability to concentrate or make decisions?', weight: 3 },
        // Add more questions as needed
    ];

    depressionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Calculate total score based on selected answers
        const totalScore = calculateTotalScore();

        // Display personalized result and advice
        displayResult(getResultMessage(totalScore));
    });

    // Dynamically load questions into the form
    loadQuestionsIntoForm();

    function loadQuestionsIntoForm() {
        const formQuestions = document.getElementById('formQuestions');

        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.innerHTML = `
                <label for="question${index + 1}">${question.text}</label>
                <select id="question${index + 1}" name="question${index + 1}">
                    <option value="not_at_all">Not at all</option>
                    <option value="several_days">Several days</option>
                    <option value="more_than_half_the_days">More than half the days</option>
                    <option value="nearly_every_day">Nearly every day</option>
                </select>
            `;
            formQuestions.appendChild(questionElement);
        });
    }

    function calculateTotalScore() {
        let totalScore = 0;

        questions.forEach((question, index) => {
            const selectedValue = document.getElementById(`question${index + 1}`).value;
            totalScore += calculateScoreForAnswer(selectedValue, question.weight);
        });

        return totalScore;
    }

    function calculateScoreForAnswer(answer, weight) {
        // Assign scores based on answer values
        switch (answer) {
            case 'not_at_all':
                return 0 * weight;
            case 'several_days':
                return 1 * weight;
            case 'more_than_half_the_days':
                return 2 * weight;
            case 'nearly_every_day':
                return 3 * weight;
            default:
                return 0;
        }
    }

    function getResultMessage(totalScore) {
        let resultMessage = '';

        // Customize the result message based on the total score
        if (totalScore <= 5) {
            resultMessage = `
                <p>
                    <strong>Based on your answers, you are in the low-risk category for depression.</strong>
                </p>
            `;
        } else if (totalScore <= 10) {
            resultMessage = `
                <p>
                    <strong>Based on your answers, you are in the moderate-risk category for depression.</strong>
                </p>
            `;
        } else {
            resultMessage = `
                <p>
                    <strong>Based on your answers, you are in the high-risk category for depression.</strong>
                </p>
            `;
        }

        // Additional feature: Display personalized advice
        resultMessage += getPersonalizedAdvice(totalScore);

        return resultMessage;
    }

    function getPersonalizedAdvice(totalScore) {
        // Additional feature: Provide personalized advice based on the total score
        let advice = '';

        if (totalScore <= 5) {
            advice = `
                <p>
                    <strong>Advice:</strong>
                    <ul>
                        <li><strong>Practice self-care:</strong> Prioritize sleep, eat healthy meals, exercise regularly, and engage in relaxation techniques like meditation or yoga.</li>
                        <li><strong>Connect with loved ones:</strong> Spend time with supportive family and friends who can offer encouragement and understanding.</li>
                        <li><strong>Challenge negative thoughts:</strong> Be mindful of negative thinking patterns and actively replace them with positive affirmations.</li>
                        <li><strong>Set achievable goals:</strong> Break down larger goals into smaller, manageable steps that can boost motivation and self-confidence.</li>
                        <li><strong>Seek professional help:</strong> If symptoms persist or worsen, consider talking to a therapist or counselor.</li>
                    </ul>
                </p>
                <p>
                    <strong>Recommendations:</strong>
                    <ul>
                        <li><strong>Start a gratitude journal:</strong> Taking time each day to write down things you are grateful for can shift your focus towards the positive aspects of life.</li>
                        <li><strong>Explore hobbies and interests:</strong> Engaging in activities you enjoy can help you relax, de-stress, and find a sense of fulfillment.</li>
                        <li><strong>Consider light therapy:</strong> Exposure to bright light can be helpful for some individuals with seasonal affective disorder (SAD).</li>
                    </ul>
                </p>
            `;
        } else if (totalScore <= 10) {
            advice = `
                <p>
                    <strong>Advice:</strong>
                    <ul>
                        <li>In addition to the advice for low depression, consider:</li>
                        <li><strong>Joining a support group:</strong> Connecting with others who understand what you're going through can provide valuable support and understanding.</li>
                        <li><strong>Learning coping skills:</strong> Explore techniques like cognitive-behavioral therapy (CBT) or mindfulness-based interventions to manage negative thoughts and emotions.</li>
                        <li><strong>Consider medication:</strong> For some individuals, medication can be an effective way to manage symptoms. Discuss this option with your doctor.</li>
                    </ul>
                </p>
                <p>
                    <strong>Recommendations:</strong>
                    <ul>
                        <li><strong>Apps and online resources:</strong> Several mobile apps and online resources offer tools and techniques for managing depression.</li>
                        <li><strong>Exercise programs:</strong> Structured exercise programs can be particularly helpful for individuals with moderate depression.</li>
                        <li><strong>Diet modifications:</strong> Consulting a nutritionist can help develop a healthy eating plan that supports mental well-being.</li>
                    </ul>
                </p>
            `;
        } else {
            advice = `
                <p>
                    <strong>Advice:</strong>
                    <ul>
                        <li>In addition to the advice for low and medium depression, consider:</li>
                        <li><strong>Hospitalization:</strong> In severe cases, hospitalization may be necessary to ensure safety and provide intensive treatment.</li>
                        <li><strong>Electroconvulsive therapy (ECT):</strong> This treatment can be effective for individuals with severe, treatment-resistant depression.</li>
                    </ul>
                </p>
                <p>
                    <strong>Recommendations:</strong>
                    <ul>
                        <li><strong>Crisis hotline:</strong> If you or someone you know is in crisis, please reach out to a crisis hotline for immediate support.</li>
                        <li><strong>Family therapy:</strong> Involving family members in the treatment process can be beneficial.</li>
                        <li><strong>Home care services:</strong> Home care services can provide additional support with daily living activities.</li>
                    </ul>
                </p>
            `;
        }

        // Additional feature: General points to remember
        advice += `
            <p>
                <strong>General Points to Remember:</strong>
                <ul>
                    <li><strong>Be patient and kind to yourself:</strong> Recovery takes time and effort. Don't be discouraged if you don't feel better immediately.</li>
                    <li><strong>Seek support:</strong> Don't hesitate to reach out to professionals and loved ones for help.</li>
                    <li><strong>There is hope:</strong> Depression is a treatable illness. With the right support and treatment, you can feel better.</li>
                </ul>
            </p>
        `;

        
        // Additional feature: Link for more details
        advice += '<p><strong>For more details, please visit:</strong> <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer">https://www.nimh.nih.gov/health/topics/depression</a></p>';

        return advice;
    }

    function displayResult(result) {
        resultSection.innerHTML = result;
    }
});
 // Function to navigate to the dashboard
 function goToDashboard() {
    // Replace 'dashboard.html' with the actual file or route for your dashboard
    window.location.href = 'dashboard.html';
}