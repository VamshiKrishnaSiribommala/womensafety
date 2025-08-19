 
document.addEventListener("DOMContentLoaded", () => {
    const statusText = document.getElementById("status");

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onstart = () => statusText.textContent = "Listening...";
    recognition.onresult = event => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("Detected:", transcript);
        if (transcript.includes("help")) {
            statusText.textContent = "🚨 HELP detected! Sending alert...";
            getLocationAndSendAlert();
            startRecording();
        }
    };

    recognition.start();

    function getLocationAndSendAlert() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                fetch("/send-sms", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ latitude, longitude })
                })
                .then(res => res.text())
                .then(msg => console.log(msg));
            }, error => console.error("Location access denied:", error));
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                setTimeout(() => {
                    mediaRecorder.stop();
                    mediaRecorder.ondataavailable = event => {
                        const formData = new FormData();
                        formData.append("file", event.data, "recording.webm");

                        fetch("http://localhost:3000/upload", {
                            method: "POST",
                            body: formData
                        }).then(res => res.json())
                        .then(data => console.log(data));
                    };
                }, 5000);
            });
    }

    function fetchFiles() {
        fetch("http://localhost:3000/files")
            .then(res => res.json())
            .then(files => {
                const fileList = document.getElementById("fileList");
                fileList.innerHTML = "";
                files.forEach(file => {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="http://localhost:3000/uploads/${file}" target="_blank">${file}</a>`;

                    fileList.appendChild(li);
                });
            });
    }
    fetchFiles();
});
