const express = require("express");
const router = express.Router();
const db = require("./db");


// ➕ ADD TO CART
router.post("/add", (req, res) => {
    const { user_id, product_id } = req.body;

    const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE quantity = quantity + 1
    `;

    db.query(sql, [user_id, product_id], (err) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Added to cart" });
    });
});


// 📦 GET CART ITEMS
router.get("/:user_id", (req, res) => {
    const userId = req.params.user_id;

    const sql = `
    SELECT p.id AS product_id, p.name, p.price, p.image, c.quantity
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.json({ error: err });
        res.json(result);
    });
});


// ➖ REMOVE ITEM
router.delete("/remove", (req, res) => {
    const { user_id, product_id } = req.body;

    const sql = "DELETE FROM cart WHERE user_id=? AND product_id=?";
    db.query(sql, [user_id, product_id], (err) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Removed" });
    });
});


// 🔼 INCREASE QTY
router.put("/increase", (req, res) => {
    const { user_id, product_id } = req.body;

    const sql = `
    UPDATE cart 
    SET quantity = quantity + 1 
    WHERE user_id=? AND product_id=?
    `;

    db.query(sql, [user_id, product_id], (err) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Increased" });
    });
});


// 🔽 DECREASE QTY
router.put("/decrease", (req, res) => {
    const { user_id, product_id } = req.body;

    const sql = `
    UPDATE cart 
    SET quantity = quantity - 1 
    WHERE user_id=? AND product_id=? AND quantity > 1
    `;

    db.query(sql, [user_id, product_id], (err) => {
        if (err) return res.json({ error: err });
        res.json({ message: "Decreased" });
    });
});

module.exports = router;