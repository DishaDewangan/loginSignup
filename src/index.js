const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const existingUser = await collection.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please use a different username or email." });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userdata = await collection.create({
            name: name.trim(),        
            email: email.trim(),       
            password: hashedPassword, 
            phone: phone.trim(),       
        });

        console.log("New user created:", userdata);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Error in /signup:", err.message);
        res.status(500).json({ message: "An error occurred while registering the user." });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }
        const user = await collection.findOne({ name });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            res.status(401).json({ message: "Invalid username or password." });
        }
    } catch (err) {
        console.error("Error in /login:", err.message);
        res.status(500).json({ message: "An error occurred while logging in." });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
