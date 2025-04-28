const { ipcRenderer } = require("electron");

const socket = io("http://10.0.0.180:3000");
ipcRenderer.invoke("get-username").then((username) => {
    socket.emit("set-username", username)
    document.title = `Tú eres "${username}"`

    socket.emit("get-messages");  // This triggers the get-messages request
});

async function send() {
    const message = document.getElementById("messageInput").value.trim();
    
    if (message) {
        const username = await ipcRenderer.invoke("get-username");

        socket.emit("message", { user: username, text: message });
        document.getElementById("messageInput").value = "";
    }
}

document.getElementById("sendBtn").addEventListener("click", send);

document.addEventListener("keypress", (e) => {
    if(e.key === 'Enter') {
        send();
    }
})

socket.on("message", (msg) => {
    displayMessage(msg);
});

// Listen for all messages sent before the user logged in
socket.on("messages", (messages) => {  // Change this to "messages"
    messages.forEach(msg => displayMessage(msg));
});

// Function to display a message
function displayMessage(msg) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message");

    let parentImg = document.createElement('img');
    let subParentDiv = document.createElement('div');
    let usernameTag = document.createElement('h4');
    let lastDiv = document.createElement('div');
    let paragraph = document.createElement('p');
    
    parentImg.src = "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg";
    parentImg.alt = "PFP";
    
    subParentDiv.classList.add('message-info');
    usernameTag.classList.add('username');
    lastDiv.classList.add('message-content');
    
    usernameTag.innerText = msg.user;
    paragraph.innerText = msg.text;
    
    messageContainer.appendChild(parentImg);
    messageContainer.appendChild(subParentDiv);
    subParentDiv.appendChild(usernameTag);
    subParentDiv.appendChild(lastDiv);
    lastDiv.appendChild(paragraph);
    
    document.getElementById("messages").appendChild(messageContainer);
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}
