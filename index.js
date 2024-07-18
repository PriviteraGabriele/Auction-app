const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const { items, addItem, removeItem, makeOffer } = require("./data/item");
const { users, addUser, findUserByEmail } = require("./data/user");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static("www"));

app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (findUserByEmail(email)) {
        return res.status(400).send("Email already in use");
    }
    addUser(email, password);
    res.status(200).send("User registered");
    console.log("🆕👤 Registered new user: " + email);
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user) {
        return res.status(400).send("Email not found");
    }
    if (user.password !== password) {
        return res.status(400).send("Incorrect password");
    }
    res.status(200).send("Login successful");
    console.log("🟢 A user connected");
});

io.on("connection", (socket) => {
    socket.emit("items", items);

    socket.on("addItem", (item) => {
        addItem(item);
        io.emit("items", items);
        console.log("🆕 Added new item");
    });

    socket.on("removeItem", (itemId) => {
        removeItem(itemId);
        io.emit("items", items);
        console.log("❌ Removed item");
    });

    socket.on("makeOffer", (itemId) => {
        makeOffer(itemId);
        io.emit("items", items);
        console.log("🆕 New offer");
    });

    socket.on("disconnect", () => {
        console.log("🔴 A user disconnected");
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log("🌐 Server is running on port " + PORT + "...");
});
