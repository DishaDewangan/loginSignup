const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/loginSignup");

connect.then(() => {
    console.log("Database connected successfully");
}).catch(() => {
    console.log("Database cannot be connected");
});

const LoginSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: false });  

const collection = new mongoose.model("users", LoginSchema);
module.exports = collection;
