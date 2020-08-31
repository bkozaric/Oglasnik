const express = require("express");
const db = require("../database/connection");

const router = express.Router();


router.post("/order/", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        const oid = new Date().getTime().toString();
        const results = await db.completeOrder(oid, req.session.userId);

        await db.clearCart(req.session.userId);
        res.status(200).json({ success: results.affectedRows, oid: oid });
    }
    catch{
        console.log(err);
        res.sendStatus(500);
    }
})

router.post("/add/", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (req.body.uId !== req.session.userId) {
            return res.status(403).json({ message: "You do not have access to this cart." });
        }
        const results = await db.addToCart(req.body.uId, req.body.adId);
        res.json({ success: results.affectedRows });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.delete("/clear/:id", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (parseInt(req.params.id) !== req.session.userId) {
            return res.status(403).json({ message: "You do not have access to this cart." });
        }
        const results = await db.clearCart(req.params.id);
        res.json({ success: results.affectedRows });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.delete("/delete/:uid&:iId", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (parseInt(req.params.uid) !== req.session.userId) {
            return res.status(403).json({ message: "You do not have access to this cart." });
        }
        const results = await db.removeFromCart(req.params.uid, req.params.iId);
        res.json({ success: results.affectedRows });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.get("/", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        /*
        if(parseInt(req.params.id) !== req.session.userId){
            return res.status(403).json({message: "You do not have access to this cart."});
        }*/
        const results = await db.allCart(req.session.userId);
        const total = await db.cartTotal(req.session.userId);
        res.json({ total: total, cartList: results });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;