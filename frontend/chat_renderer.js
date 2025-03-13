const { ipcRenderer } = require("electron");

const socket = io("http://localhost:3000");
ipcRenderer.invoke("get-username").then((username) => {
    socket.emit("set-username", username)
});

document.getElementById("sendBtn").addEventListener("click", async () => {
    const message = document.getElementById("messageInput").value.trim();
    
    if (message) {
        const username = await ipcRenderer.invoke("get-username");

        socket.emit("message", { user: username, text: message });
        document.getElementById("messageInput").value = "";
    }
});

socket.on("message", (msg) => {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message");

    messageContainer.innerHTML = `
        <img src="https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg" alt="PFP">
                <div class="message-info">
                    <h4 class="username">${msg.user}</h4>
                    <div class="message-content">
                        <p>${msg.text}</p>
                    </div>
                </div>
    `;

    document.getElementById("messages").appendChild(messageContainer);
});