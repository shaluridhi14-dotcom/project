const express = require("express");
const router = express.Router();
const db = require("./db"); // your mysql connection

// Submit Feedback
router.post("/submit-feedback", (req, res) => {
    const { name, email,subject, message } = req.body;

    if (!name || !email || !message) {
        return res.json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO message (name, email, subject, message) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email,subject, message], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ message: "Error submitting feedback" });
        }

        res.json({ message: "Feedback submitted successfully!" });
    });
});

module.exports = router;