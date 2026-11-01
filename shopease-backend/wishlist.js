const express = require("express");
const router = express.Router();
const db = require("./db");

// ADD
router.post("/add", (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({
            success: false,
            message: "Missing data"
        });
    }

    const check = "SELECT * FROM wishlist WHERE user_id=? AND product_id=?";

    db.query(check, [user_id, product_id], (err, result) => {
        if (err) {
            console.log("WISHLIST ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Wishlist operation failed"
            });
        }

        // Product already exists
        if (result.length > 0) {
            return res.json({
                success: true,
                message: "Already exists"
            });
        }

        // Insert new product
        const insert = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";

        db.query(insert, [user_id, product_id], (err) => {
            if (err) {
                console.log("WISHLIST INSERT ERROR:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to add to wishlist"
                });
            }

            res.json({
                success: true,
                message: "Added to wishlist"
            });
        });
    });
});

// REMOVE
router.delete("/remove", (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({
            success: false,
            message: "Missing data"
        });
    }

    const query = "DELETE FROM wishlist WHERE user_id=? AND product_id=?";

    db.query(query, [user_id, product_id], (err, result) => {
        if (err) {
            console.log("WISHLIST REMOVE ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to remove product"
            });
        }

        res.json({
            success: true,
            message: "Removed from wishlist"
        });
    });
});
// CHECK IF PRODUCT EXISTS IN WISHLIST
router.get("/check/:user_id/:product_id", (req, res) => {
    const { user_id, product_id } = req.params;

    const query = `
        SELECT * FROM wishlist
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(query, [user_id, product_id], (err, result) => {
        if (err) {
            console.log("WISHLIST CHECK ERROR:", err);
            return res.status(500).json({
                success: false,
                exists: false
            });
        }

        res.json({
            success: true,
            exists: result.length > 0
        });
    });
});

// GET USER WISHLIST
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    const query = `
        SELECT products.*
        FROM wishlist
        JOIN products ON wishlist.product_id = products.id
        WHERE wishlist.user_id = ?
    `;

    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.log("WISHLIST FETCH ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch wishlist"
            });
        }

        res.json(result);
    });
});
module.exports = router;