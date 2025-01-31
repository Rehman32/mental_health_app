function calculateMBTI() {
    // Get input values
    const question1 = parseInt(document.getElementById('question1').value);
    const question2 = parseInt(document.getElementById('question2').value);
    const question3 = parseInt(document.getElementById('question3').value);
    const question4 = parseInt(document.getElementById('question4').value);
    const question5 = parseInt(document.getElementById('question5').value);

    // Validate input values
    if (isNaN(question1) || isNaN(question2) || isNaN(question3) || isNaN(question4) || isNaN(question5)) {
        alert('Please answer all questions with numerical values.');
        return;
    }

    // Determine MBTI personality type based on input
    const extraversion = question1 > question2 ? 'E' : 'I';
    const intuition = question2 > question1 ? 'N' : 'S';
    const thinking = question3 > question4 ? 'T' : 'F';
    const judging = question5 > (question1 + question2) / 2 ? 'J' : 'P';

    const mbtiType = extraversion + intuition + thinking + judging;

    // Display MBTI personality type
    document.getElementById('personalityOutput').innerHTML = `<p>Your MBTI Personality Type: ${mbtiType}</p>`;

    // Display key characteristics based on MBTI type
    let characteristics;
    switch (mbtiType) {
        case 'ENTJ':
            characteristics = 'Key Characteristics: Strategic, assertive, natural leaders, enjoy challenges.';
            break;
        case 'INTJ':
            characteristics = 'Key Characteristics: Visionary, analytical, independent, strategic thinkers.';
            break;
        case 'ENTP':
            characteristics = 'Key Characteristics: Creative, curious, enthusiastic, innovative.';
            break;
        case 'INTP':
            characteristics = 'Key Characteristics: Logical, adaptable, independent, love theoretical ideas.';
            break;
        case 'ENFJ':
            characteristics = 'Key Characteristics: Empathetic, charismatic, inspirational, sociable.';
            break;
        case 'INFJ':
            characteristics = 'Key Characteristics: Insightful, compassionate, visionary, value deep connections.';
            break;
        case 'ENFP':
            characteristics = 'Key Characteristics: Energetic, imaginative, optimistic, enjoy exploring possibilities.';
            break;
        case 'INFP':
            characteristics = 'Key Characteristics: Idealistic, creative, sensitive, value authenticity.';
            break;
        case 'ESTJ':
            characteristics = 'Key Characteristics: Organized, decisive, responsible, natural leaders.';
            break;
        case 'ISTJ':
            characteristics = 'Key Characteristics: Reliable, systematic, practical, strong sense of duty.';
            break;
        case 'ESFJ':
            characteristics = 'Key Characteristics: Sociable, supportive, conscientious, enjoy harmonious environments.';
            break;
        case 'ISFJ':
            characteristics = 'Key Characteristics: Caring, dependable, detail-oriented, value traditions.';
            break;
        case 'ESTP':
            characteristics = 'Key Characteristics: Adventurous, action-oriented, pragmatic, enjoy new challenges.';
            break;
        case 'ISTP':
            characteristics = 'Key Characteristics: Logical, adaptable, hands-on, enjoy exploring how things work.';
            break;
        case 'ESFP':
            characteristics = 'Key Characteristics: Enthusiastic, spontaneous, sociable, enjoy being in the spotlight.';
            break;
        case 'ISFP':
            characteristics = 'Key Characteristics: Creative, sensitive, gentle, value aesthetics.';
            break;
        default:
            characteristics = 'No specific characteristics available.';
    }

    // Display key characteristics
    document.getElementById('keyCharacteristics').innerHTML = `<p>${characteristics}</p>`;

    // Display personalized recommendation based on MBTI type
    let recommendation;
    switch (mbtiType) {
        case 'ENTJ':
            recommendation = 'You are an ENTJ, known as "The Commander." Embrace your leadership skills and strategic thinking.';
            break;
        case 'INTJ':
            recommendation = 'You are an INTJ, known as "The Architect." Cultivate your analytical and visionary abilities.';
            break;
        case 'ENTP':
            recommendation = 'You are an ENTP, known as "The Debater." Embrace your creativity and enjoy exploring possibilities.';
            break;
        case 'INTP':
            recommendation = 'You are an INTP, known as "The Logician." Nurture your curiosity and analytical thinking.';
            break;
        case 'ENFJ':
            recommendation = 'You are an ENFJ, known as "The Protagonist." Use your empathy and charisma to inspire others.';
            break;
        case 'INFJ':
            recommendation = 'You are an INFJ, known as "The Advocate." Channel your compassion and insight for positive change.';
            break;
        case 'ENFP':
            recommendation = 'You are an ENFP, known as "The Campaigner." Leverage your enthusiasm and creativity to connect with others.';
            break;
        case 'INFP':
            recommendation = 'You are an INFP, known as "The Mediator." Embrace your idealism and focus on personal growth.';
            break;
        case 'ESTJ':
            recommendation = 'You are an ESTJ, known as "The Executive." Utilize your organizational skills and decisiveness for success.';
            break;
        case 'ISTJ':
            recommendation = 'You are an ISTJ, known as "The Inspector." Leverage your reliability and attention to detail in your endeavors.';
            break;
        case 'ESFJ':
            recommendation = 'You are an ESFJ, known as "The Consul." Use your sociability and empathy to create harmonious environments.';
            break;
        case 'ISFJ':
            recommendation = 'You are an ISFJ, known as "The Defender." Embrace your dedication and caring nature in your relationships.';
            break;
        case 'ESTP':
            recommendation = 'You are an ESTP, known as "The Dynamo." Use your spontaneity and energy to take on new challenges.';
            break;
        case 'ISTP':
            recommendation = 'You are an ISTP, known as "The Virtuoso." Embrace your practicality and adaptability for success.';
            break;
        case 'ESFP':
            recommendation = 'You are an ESFP, known as "The Entertainer." Leverage your enthusiasm and charm to bring joy to others.';
            break;
        case 'ISFP':
            recommendation = 'You are an ISFP, known as "The Adventurer." Embrace your creativity and sensitivity in your pursuits.';
            break;
        default:
            recommendation = 'No specific recommendation available.';
    }

    // Display personalized recommendation
    document.getElementById('recommendation').innerHTML = `<p>Recommendation: ${recommendation}</p>`;
}

// Function to navigate to the dashboard (you can customize this according to your application)
function goToDashboard() {
    window.location.href='dashboard.html';
}
