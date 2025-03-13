const { ipcRenderer } = require("electron");

document.getElementById("enter-button").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();

    if(username.length >= 3) {
        ipcRenderer.send("set-username", username);
    } else {
        alert("El nombre debe tener al menos tres caracteres.");
    }
});