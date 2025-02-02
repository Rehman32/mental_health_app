  // Simulated emotion analysis function (replace with actual API call)
  function analyzeText(text) {
    // Simulate API processing time
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate emotion analysis results
            const emotions = {
                joy: Math.random(),
                sadness: Math.random(),
                anger: Math.random(),
                fear: Math.random(),
                surprise: Math.random()
            };
            resolve(emotions);
        }, 1000);
    });
}

// Initialize emotion chart
const ctx = document.getElementById('emotionChart').getContext('2d');
const emotionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Joy',
            data: [],
            borderColor: '#fdcb6e',
            tension: 0.4
        }, {
            label: 'Sadness',
            data: [],
            borderColor: '#74b9ff',
            tension: 0.4
        }, {
            label: 'Anger',
            data: [],
            borderColor: '#ff7675',
            tension: 0.4
        }, {
            label: 'Fear',
            data: [],
            borderColor: '#a29bfe',
            tension: 0.4
        }, {
            label: 'Surprise',
            data: [],
            borderColor: '#55efc4',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 1
            }
        }
    }
});

// Handle real-time analysis
let analysisTimeout;
const textInput = document.getElementById('text-input');
textInput.addEventListener('input', () => {
    clearTimeout(analysisTimeout);
    analysisTimeout = setTimeout(() => {
        if (textInput.value.trim().length > 0) {
            analyzeEmotion();
        }
    }, 500);
});

async function analyzeEmotion() {
    const text = document.getElementById('text-input').value;
    if (!text.trim()) return;

    document.getElementById('loading').style.display = 'block';

    try {
        const emotions = await analyzeText(text);
        updateResults(emotions);
        updateChart(emotions);
    } catch (error) {
        console.error('Analysis failed:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function updateResults(emotions) {
    const currentEmotions = document.getElementById('current-emotions');
    const dominantEmotion = document.getElementById('dominant-emotion');

    currentEmotions.innerHTML = '';
    Object.entries(emotions).forEach(([emotion, value]) => {
        const percentage = (value * 100).toFixed(1);
        const indicator = document.createElement('div');
        indicator.className = 'emotion-indicator';
        indicator.innerHTML = `
            <div class="emotion-dot" style="background-color: ${getEmotionColor(emotion)}"></div>
            <span>${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${percentage}%</span>
        `;
        currentEmotions.appendChild(indicator);
    });

    const dominant = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b);
    dominantEmotion.innerHTML = `
        <h3 style="color: ${getEmotionColor(dominant[0])}">
            ${dominant[0].charAt(0).toUpperCase() + dominant[0].slice(1)}
        </h3>
        <p>${(dominant[1] * 100).toFixed(1)}%</p>
    `;
}

function updateChart(emotions) {
    const timestamp = new Date().toLocaleTimeString();
    emotionChart.data.labels.push(timestamp);

    Object.entries(emotions).forEach(([emotion, value], index) => {
        emotionChart.data.datasets[index].data.push(value);
    });

    // Keep only last 10 data points
    if (emotionChart.data.labels.length > 10) {
        emotionChart.data.labels.shift();
        emotionChart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    emotionChart.update();
}

function getEmotionColor(emotion) {
    const colors = {
        joy: '#fdcb6e',
        sadness: '#74b9ff',
        anger: '#ff7675',
        fear: '#a29bfe',
        surprise: '#55efc4'
    };
    return colors[emotion];
}
