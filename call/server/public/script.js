document.getElementById("callButton").addEventListener("click", () => {
    fetch("/call", { method: "POST" })
        .then(async response => {
            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                alert(data.message || "Emergency calls placed!");
            } else {
                alert(data.message || "Failed to make calls");
            }
        })
        .catch(() => alert("Network error while making the call"));
});
