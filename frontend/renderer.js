const { ipcRenderer } = require("electron");

const displayError = (message) => {
    const msg = document.getElementById("error");
    
    msg.innerText = message;
    setTimeout(() => {
        msg.innerText = "";
    }, 5000);
};

async function login() {
    const username = document.getElementById("username").value.trim();

    if(username.length >= 3) {
        await fetch('http://10.0.0.180:3000/status', {method: 'GET'}).then(_ => {
            ipcRenderer.send("set-username", username);
        }).catch(_ => {
            displayError("El servidor no está activo. Enviar un mensaje a un administrador.");
            return;
        });
    } else {
        alert("El nombre debe tener al menos tres caracteres.");
    }
}

document.getElementById("enter-button").addEventListener("click", login);

document.addEventListener("keypress", (e) => {
    if(e.key === 'Enter') {
        login();
    }
});
