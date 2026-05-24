 const express = require("express");
 const router = express.Router();
 const db = require("./db");
 
 
 router.get("/search", (req, res) => {

    const keyword = req.query.q;

    if(!keyword){
        return res.json([]);
    }
  const value = `%${keyword}%`;
  
    const query = `
        SELECT * FROM products 
        WHERE name LIKE ?
    `;

    db.query(query, [value], (err, result) => {
        if(err) return res.send(err);

        res.json(result);
    });

});

module.exports = router;