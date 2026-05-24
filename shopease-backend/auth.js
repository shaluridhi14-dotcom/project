const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcryptjs");


// ================= SEND OTP =================
router.post("/send-otp", (req, res) => {
    const { email } = req.body;

    // check user
    db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length === 0) {
            return res.json({ message: "User not found" });
        }

        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiry = Date.now() + 5 * 60 * 1000;

        // save OTP
        db.query(
            "UPDATE users SET otp=?, otp_expiry=? WHERE email=?",
            [otp, expiry, email],
            (err) => {
                if (err) return res.status(500).send(err);

                res.json({
                    message: "OTP sent",
                    otp: otp   // ⚠️ testing only
                });
            }
        );
    });
});


// ================= VERIFY OTP =================
router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=? AND otp=? AND otp_expiry > ?",
        [email, otp, Date.now()],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.json({ message: "Invalid or expired OTP" });
            }

            res.json({ message: "OTP verified" });
        }
    );
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query(
        "UPDATE users SET password=?, otp=NULL, otp_expiry=NULL WHERE email=?",
        [hashedPassword, email],
        (err) => {
            if (err) return res.status(500).send(err);

            res.json({ message: "Password reset successful" });
        }
    );
});

module.exports = router;