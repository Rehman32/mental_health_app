
document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });
    const stressForm = document.getElementById("stressForm");
    const sliders = document.querySelectorAll(".stress-slider");

    // Update slider values dynamically
    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        slider.addEventListener("input", () => {
            valueDisplay.textContent = `${slider.value}/10`;
        });
    });

    function calculateStress() {
        const workload = parseInt(document.getElementById('workload').value);
        const relationships = parseInt(document.getElementById('relationships').value);
        const health = parseInt(document.getElementById('health').value);
        const finances = parseInt(document.getElementById('finances').value);

        // Update individual scores
        document.getElementById('workScore').textContent = workload + '/10';
        document.getElementById('relationScore').textContent = relationships + '/10';
        document.getElementById('healthScore').textContent = health + '/10';
        document.getElementById('financeScore').textContent = finances + '/10';

        // Calculate overall stress score
        const stressScore = (workload + relationships + health + finances) / 4;
        
        // Update stress meter with smooth transition
        const stressLevel = document.getElementById('stressLevelIndicator');
        stressLevel.style.transition = "width 1s ease-in-out";
        stressLevel.style.width = `${(stressScore / 10) * 100}%`;

        // Generate recommendations
        const recommendations = document.getElementById('recommendations');
        const category = getStressCategory(stressScore);
        const advice = getStressAdvice(category, { workload, relationships, health, finances });

        recommendations.innerHTML = `
            <h3>Stress Level: ${category}</h3>
            <p>Overall Score: ${stressScore.toFixed(1)}/10</p>
            <h4>Personalized Recommendations:</h4>
            <ul>
                ${advice.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;

        saveStressHistory(stressScore);
        displayStressHistory();
    }

    function getStressCategory(score) {
        if (score < 4) return "Low Stress";
        if (score < 7) return "Moderate Stress";
        return "High Stress";
    }

    function getStressAdvice(category, scores) {
        let advice = [];

        // General advice based on category
        if (category === "Low Stress") {
            advice.push("Maintain your current stress management techniques.");
            advice.push("Continue practicing mindfulness and self-care.");
        } else if (category === "Moderate Stress") {
            advice.push("Engage in relaxation techniques such as deep breathing or meditation.");
            advice.push("Ensure you get enough sleep and maintain a healthy diet.");
        } else {
            advice.push("Consider speaking with a counselor or therapist.");
            advice.push("Identify stress triggers and develop coping mechanisms.");
        }

        // Specific recommendations based on the highest stress factor
        const highestFactor = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        
        switch (highestFactor) {
            case "workload":
                advice.push("Prioritize tasks and set realistic goals to manage workload better.");
                advice.push("Take short breaks during work to avoid burnout.");
                break;
            case "relationships":
                advice.push("Communicate openly with loved ones about your concerns.");
                advice.push("Try to set healthy boundaries in relationships.");
                break;
            case "health":
                advice.push("Engage in regular physical activity to boost mental well-being.");
                advice.push("Schedule regular health checkups and practice self-care.");
                break;
            case "finances":
                advice.push("Create a budget and set financial goals to reduce money-related stress.");
                advice.push("Seek professional financial advice if needed.");
                break;
        }

        return advice;
    }
     // Function to handle form submission
     function submitStressData() {
        const workload = document.getElementById("workload").value;
        const relationships = document.getElementById("relationships").value;
        const health = document.getElementById("health").value;
        const finances = document.getElementById("finances").value;

        console.log("Submitting stress data:", { workload, relationships, health, finances });

        fetch("/stress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ workload, relationships, health, finances }),
        })
        .then(response => response.text())
        .then(data => {
            console.log("Server response:", data);
            alert(data); // Show response to user
            fetchStressHistory(); // Refresh stress history
        })
        .catch(error => {
            console.error("Error submitting stress data:", error);
            alert("Error saving stress data.");
        });
    }

     // Fetch past stress records
     function fetchStressHistory() {
        fetch("/stress-history")
        .then(response => response.json())
        .then(data => {
            const historyDiv = document.getElementById("stressHistory");
            historyDiv.innerHTML = "<h3>Past Stress Records</h3>";
            if (data.length === 0) {
                historyDiv.innerHTML += "<p>No past records found.</p>";
                return;
            }
            data.forEach(record => {
                historyDiv.innerHTML += `
                    <div class="history-item">
                        <p><strong>Workload:</strong> ${record.workload}/10</p>
                        <p><strong>Relationships:</strong> ${record.relationships}/10</p>
                        <p><strong>Health:</strong> ${record.health}/10</p>
                        <p><strong>Finances:</strong> ${record.finances}/10</p>
                        <p><strong>Stress Score:</strong> ${record.stress_score}</p>
                        <p><strong>Recorded At:</strong> ${record.recorded_at}</p>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error fetching stress history:", error));
    }

    // Load past stress records when page loads
    fetchStressHistory();

    

     // Attach event listener to button
     document.querySelector(".calculate-btn").addEventListener("click", submitStressData);
});

