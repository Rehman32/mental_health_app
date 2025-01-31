// emotion.js
const emojis = document.querySelectorAll('#emojis img');
const messageInput = document.getElementById('message');
const analyzeButton = document.getElementById('analyze-button');
const resultDiv = document.getElementById('analysis-result');
const emotionChartDiv = document.getElementById('emotion-chart');
const recommendationsDiv = document.getElementById('recommendations');

const analyzeEmotion = () => {
  let selectedEmotion = null;
  let message = messageInput.value.trim();

  // Check if an emoji is selected
  for (const emoji of emojis) {
    if (emoji.classList.contains('selected')) {
      selectedEmotion = emoji.dataset.emotion;
      break;
    }
  }

  if (!selectedEmotion && !message) {
    alert('Please select an emoji or enter a message.');
    return;
  }

  // Perform emotion analysis based on selected emoji and message
  // You can replace this code with your chosen emotion analysis API or library

  let analysisResult = '';
  if (selectedEmotion) {
    analysisResult = `Based on your selected emoji, it seems you are feeling ${selectedEmotion}.`;
  }

  if (message) {
    analysisResult += ` Your message suggests that you are also feeling ${message}`;
  }

  // Display the analysis result
  resultDiv.innerHTML = analysisResult;

  // Visualize emotion with a chart (replace this with your preferred chart library)
  visualizeEmotion(selectedEmotion);

  // Display mood-specific recommendations
  displayRecommendations(selectedEmotion);
};

analyzeButton.addEventListener('click', analyzeEmotion);

emojis.forEach((emoji) => {
  emoji.addEventListener('click', () => {
    emojis.forEach((e) => e.classList.remove('selected'));
    emoji.classList.add('selected');
  });
});

function visualizeEmotion(emotion) {
  // Use a chart library to visualize the emotion data (e.g., Chart.js, D3.js)
  // For simplicity, let's use a basic text display for now
  emotionChartDiv.innerHTML = `Emotion Chart: ${emotion}`;
}

function displayRecommendations(emotion) {
  // Replace with your recommendation logic based on the selected emotion
  let recommendations = '';
  switch (emotion) {
    case 'happy':
      recommendations = 'Recommended practices for happiness: Practice gratitude, engage in activities you enjoy, and connect with loved ones.';
      break;
    case 'sad':
      recommendations = 'Recommended practices for sadness: Take time for self-care, talk to a friend, and engage in activities that bring comfort.';
      break;
    case 'angry':
      recommendations = 'Recommended practices for anger: Practice deep breathing, take a break, and find healthy ways to express your feelings.';
      break;
    case 'surprised':
      recommendations = 'Recommended practices for surprise: Embrace the unexpected, reflect on positive aspects, and adapt to new situations.';
      break;
    case 'neutral':
      recommendations = 'Recommended practices for a neutral mood: Explore new activities, set personal goals, and maintain a balanced routine.';
      break;
    default:
      recommendations = 'No specific recommendations for the selected mood.';
  }

  // Display recommendations
  recommendationsDiv.innerHTML = recommendations;
}

function goToDashboard() {
  // Replace 'dashboard.html' with the actual file or route for your dashboard
  window.location.href = 'dashboard.html';
}
