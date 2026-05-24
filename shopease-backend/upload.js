const multer = require("multer");
const path = require("path");
const db = require("./db");
const express = require("express");
const router = express.Router();

// MULTER SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET PROFILE
router.get("/profile/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching profile" });
    }

    if (result.length === 0) {
      return res.json({ message: "User not found" });
    }

    res.json(result[0]);
  });
});


// UPDATE PROFILE
router.post("/update-profile", upload.single("image"), (req, res) => {

const image = req.file ? req.file.filename : null;
  const {
    id, name, mobile,
    gender, language, occupation, address,
    city, state, country, pincode
  } = req.body;

  let imageName = null;

  if (req.file) {
    imageName = req.file.filename;
  }

  const sql = `
    UPDATE users SET
      name=?,
      mobile=?,
      gender=?,
      language=?,
      occupation=?,
      address=?,
      city=?,
      state=?,
      country=?,
      pincode=?,
      profile_image = COALESCE(?, profile_image)
    WHERE id=?
  `;

  db.query(sql, [
    name, mobile, gender, language, occupation, address,
    city, state, country, pincode,
    imageName,
    id
  ], (err, result) => {

    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.json({ message: "No user found with this ID" });
    }
    res.json({
      success:true,
      message: "Profile Updated Successfully",
      image: imageName  
    });
  });

});

module.exports = router;