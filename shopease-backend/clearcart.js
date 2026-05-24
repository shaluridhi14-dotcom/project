const express = require("express");
const router = express.Router();
const db = require("./db");


rrouter.delete("/cart/clear/:user_id", (req, res) => {

    const userId = parseInt(req.params.user_id);

    if(!userId){
        return res.status(400).json({message: "User ID missing"});
    }

    const query = "DELETE FROM cart WHERE user_id = ?";

    db.query(query, [userId], (err) => {

        if(err){
            console.log("CLEAR ERROR:", err);
            return res.status(500).json({message: "DB error"});
        }

        res.json({message: "Cart cleared"});
    });
});

module.exports = router;