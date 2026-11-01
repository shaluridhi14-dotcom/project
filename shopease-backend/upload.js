const crypto = require("crypto");
const db = require("./db");
const express = require("express");
const router = express.Router();

// CLOUDINARY IMAGE UPLOAD
async function uploadToCloudinary(file) {
    const timestamp = Math.floor(Date.now() / 1000);

    const params = `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

    const signature = crypto
        .createHash("sha1")
        .update(params)
        .digest("hex");

    const formData = new FormData();

    formData.append("file", new Blob([file.buffer], {
        type: file.mimetype
    }), file.originalname);

    formData.append("api_key", process.env.CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
}

// MULTER MEMORY STORAGE
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// GET PROFILE
router.get("/profile/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching profile"
            });
        }

        if (result.length === 0) {
            return res.json({
                message: "User not found"
            });
        }

        res.json(result[0]);
    });
});
// UPDATE PROFILE
router.post("/update-profile", upload.single("image"), async (req, res) => {

    try {
        const {
            id, name, mobile,
            gender, language, occupation, address,
            city, state, country, pincode
        } = req.body;

        let imageUrl = null;

        // Upload image to Cloudinary
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file);
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
            imageUrl,
            id
        ], (err, result) => {

            if (err) {
                console.log("DB ERROR:", err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No user found with this ID"
                });
            }

            res.json({
                success: true,
                message: "Profile Updated Successfully",
                image: imageUrl
            });
        });

    } catch (error) {
        console.log("PROFILE UPDATE ERROR:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

});

// EXPORT ROUTER
module.exports = router;