const express = require("express");
const app = express();
const port = 3000;

// Sett up bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

const userSchema = new mongoose.Schema({
    fullName: String,
    // Email is unique. Stimulate an error by creating new user whose email already exists.
    email: {
        type: String,
        unique: true
    },
    phoneNumber: String
});
const User = mongoose.model("User", userSchema);

// Test UI
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/user", async (req, res) => {
    const data = new User(req.body);
    try {
        const user = await data.save();
        res.send({ user });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
