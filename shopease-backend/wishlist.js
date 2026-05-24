const express = require("express");
const router = express.Router();
const db = require("./db");

// ✅ ADD
router.post("/add", (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.json({ message: "Missing data" });
    }

    const check = "SELECT * FROM wishlist WHERE user_id=? AND product_id=?";
    db.query(check, [user_id, product_id], (err, result) => {
        if (err) return res.json(err);

        if (result.length > 0) {
            return res.json({ message: "Already exists" });
        }

        const insert = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
        db.query(insert, [user_id, product_id], (err) => {
            if (err) return res.json(err);
            res.json({ message: "Added" });
        });
    });
});

// ✅ REMOVE
router.delete("/remove", (req, res) => {
    const { user_id, product_id } = req.body;

    const query = "DELETE FROM wishlist WHERE user_id=? AND product_id=?";
    db.query(query, [user_id, product_id], (err) => {
        if (err) return res.json(err);
        res.json({ message: "Removed" });
    });
});

// ✅ GET USER WISHLIST
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    const query = `
        SELECT products.* 
        FROM wishlist 
        JOIN products ON wishlist.product_id = products.id
        WHERE wishlist.user_id = ?
    `;

    db.query(query, [user_id], (err, result) => {
        if (err) return res.json(err);
        res.json(result);
    });
});

module.exports = router;