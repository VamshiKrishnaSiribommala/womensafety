document.addEventListener("DOMContentLoaded", () => {
    const panicButton = document.getElementById("panicButton");

    panicButton.addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(sendAlert, showError);
        } else {
            alert("Geolocation is not supported by your browser.");
        }

        // Play siren sound
        const siren = new Audio("siren.mp3");
        siren.play();
    });

    function sendAlert(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Send alert to backend
        fetch("/emergency-alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude })
        })
        .then(response => response.json())
        .then(data => alert("🚨 Alert sent successfully!"))
        .catch(error => alert("⚠️ Failed to send alert!"));
    }

    function showError(error) {
        alert("Error getting location: " + error.message);
    }
});
