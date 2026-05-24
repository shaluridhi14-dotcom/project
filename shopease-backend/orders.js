const express = require("express");
const router = express.Router();
const db = require("./db");


/* ===========================
   ✅ PLACE ORDER
=========================== */
router.post("/order", (req, res) => {
    const { user_id, name, email, phone, address, cart, total } = req.body;

    if (!user_id || !name || !cart || cart.length === 0) {
        return res.json({ message: "Invalid data" });
    }

    const orderQuery = `
        INSERT INTO orders (user_id, name, email, phone, address, total)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(orderQuery, [user_id, name, email, phone, address, total], (err, result) => {
        if (err) {
            console.log("ORDER ERROR:", err);
            return res.json({ message: "Order failed" });
        }

        const order_id = result.insertId;

        const itemQuery = `
            INSERT INTO order_items (order_id, product_name, price, quantity)
            VALUES ?
        `;

        const values = cart.map(item => [
            order_id,
            item.name,
            item.price,
            item.quantity
        ]);

        db.query(itemQuery, [values], (err2) => {
            if (err2) {
                console.log("ITEM ERROR:", err2);
                return res.json({ message: "Order items failed" });
            }

            res.json({ message: "Order placed successfully" });
        });
    });
});


/* ===========================
   ✅ GET USER ORDERS
=========================== */
router.get("/orders/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    const query = `
        SELECT * FROM orders
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.log("FETCH ORDERS ERROR:", err);
            return res.json([]);
        }
        res.json(result);
    });
});


/* ===========================
   ✅ GET ORDER ITEMS
=========================== */
router.get("/order-items/:order_id", (req, res) => {
    const order_id = req.params.order_id;

    const query = "SELECT * FROM order_items WHERE order_id = ?";

    db.query(query, [order_id], (err, result) => {
        if (err) {
            console.log("FETCH ITEMS ERROR:", err);
            return res.json([]);
        }
        res.json(result);
    });
});


/* ===========================
   ✅ GET CART
=========================== */
router.get("/cart/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    db.query("SELECT * FROM cart WHERE user_id = ?", [user_id],
        (err, result) => {
            if (err) return res.json([]);
            res.json(result);
        });
});


/* ===========================
   ✅ CLEAR CART
=========================== */
router.delete("/cart/clear/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    db.query("DELETE FROM cart WHERE user_id = ?", [user_id],
        (err) => {
            if (err) {
                console.log("CLEAR CART ERROR:", err);
                return res.json({ message: "Error clearing cart" });
            }
            res.json({ message: "Cart cleared" });
        });
});


/* ===========================
   ✅ GET USER DETAILS
=========================== */
router.get("/user/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM users WHERE id = ?", [id],
        (err, result) => {
            if (err || result.length === 0) return res.json({});
            res.json(result[0]);
        });
});


module.exports = router;