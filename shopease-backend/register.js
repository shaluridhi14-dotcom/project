const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./db"); 


router.post("/register", (req, res) => {

    const { name, email, mobile, password } = req.body;

   
    if (!name || !email || !mobile || !password) {
        return res.send("All fields are required");
    }

    
    const checksql = "SELECT * FROM users WHERE email = ?";
    db.query(checksql, [email], async (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        if (result.length > 0) {
            return res.send("Email already exists");
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const insertsql = "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)";

        db.query(insertsql, [name, email, mobile, hashedPassword], (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Something went wrong");
            }

            return res.send("Account Created Successfully!");
        });
    });
});
module.exports = router;