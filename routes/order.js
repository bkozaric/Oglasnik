const express = require("express");
const db = require("../database/connection");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        const results = await db.allOrders(req.session.userId);

        const allOrderInfo = await Promise.all(results.map(order => {
            return db.fetchOrderInfo(req.session.userId, order.orderId).then(orderInfo => ({
                orderId: order.orderId,
                orderInfo
            }))
        }))

        res.json(allOrderInfo);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})


router.delete("/cancel/:oid&:uid", async (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ message: "You are not logged in" });
    }
    if (parseInt(req.params.uid) !== req.session.userId) {
        return res.status(403).json({ message: "You are not logged in as this user. Access denied." });
    }
    try{
        const results = await db.cancelOrder(req.session.userId, req.params.oid);
        return res.json({success: results.affectedRows > 0 ? 1 : 0 });
    }
    catch (err){
        return res.sendStatus(500);
    }
})

router.post("/orderinfo/", async (req, res) => {
    try {
        const { oid, uid } = req.body;
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (uid !== req.session.userId) {
            return res.status(403).json({ message: "You are not logged in as this user. Access denied." });
        }
        const results = await db.fetchOrderInfo(uid, oid);
        res.status(200).json(results);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})



module.exports = router;