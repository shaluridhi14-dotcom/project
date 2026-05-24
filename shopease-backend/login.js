const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./db");

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.json({ message: err });

    if (result.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
  return res.json({
    success: true,
    message: "Login successful",
    user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
          profile_image: user.profile_image
        }
  });
} else {
  return res.json({ success: false, message: "Invalid password" });
}
});
});
module.exports = router;