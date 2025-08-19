let timerId = null;

async function startTimer() {
    const timeLimit = document.getElementById("timeLimit").value;
    
    if (!timeLimit || timeLimit <= 0) {
        alert("Enter a valid time in seconds.");
        return;
    }

    const response = await fetch("http://localhost:3000/start-timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeLimit })
    });

    const data = await response.json();
    timerId = data.timerId;
    document.getElementById("status").innerText = "⏳ Timer started!";
}

async function cancelTimer() {
    if (!timerId) {
        alert("No active timer to cancel.");
        return;
    }

    await fetch("http://localhost:3000/cancel-timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerId })
    });

    document.getElementById("status").innerText = "✅ Timer canceled!";
}
