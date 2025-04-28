const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let users = {};
let messages = []; // Store messages in an array
io.on("connection", (socket) => {
    socket.on("set-username", (username) => {
        users[socket.id] = username;
        console.log(`Username set for ${socket.id}: ${username}`);
    });

    // Handle 'get-messages' event
    socket.on("get-messages", () => {
        socket.emit("messages", messages); // Send all messages to the client
    });

    socket.on("message", (data) => {
        const { user, text } = data;
        io.emit("message", { user, text });
        messages.push(data); // Store the message in the messages array
        console.log(messages);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id, `(${users[socket.id]})`);
        delete users[socket.id];
    });
});

app.get('/status', (req, res) => {
    res.send('Server is up :)');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
