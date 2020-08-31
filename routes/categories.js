const express = require("express");
const db = require("../database/connection");
const fetch = require("node-fetch");

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const results = await db.getCategories();
        res.json(results);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

	

/*
router.get("/:id", async (req, res) => {
    try {
        const results = await db.fetchAd(req.params.id);
        if (results.length === 0) {
            return res.status(404).json({ message: "This ad does not exist." });
        }
        const imageResults = await db.getImages(req.params.id);
        res.json({ ...results, image: imageResults });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.put("/edit/:id", async (req, res) => {
    try {
        //image[] - todo
        const { id, title, description, price, image, uid } = req.body;
        //console.log(req.body);
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (uid !== req.session.userId) {
            return res.status(403).json({ message: "You do not have permission to edit this ad." });
        }

        const results = await db.editAd(id, title, description, price);

        image.forEach(async (img) => {
            await db.insertImages(img, id);
        });

        res.json({ success: results.affectedRows });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post("/checkImage", async (req, res) => {
    try {
        const response = await fetch(req.body.url);
        if (response.status === 200) {
            if (response.headers.get("content-type").startsWith("image")) {
                return res.json({ isImage: 1 });
            }
        } else {
            return res.json({ isImage: 0 });
        }
    } catch (e) {
        return res.json({ isImage: 0 });
    }
})

router.delete("/delete/:id", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        const getAdAuthor = await db.fetchAd(req.params.id);
        if (!getAdAuthor[0]) {
            return res.status(404).json({ message: "This ad does not exist" });
        }
        if (getAdAuthor[0].addedBy !== req.session.userId) {
            return res.status(403).json({ message: "You do not have permission to delete this ad." });
        }
        const results = await db.deleteAd(req.params.id);
        res.json({ success: results.affectedRows });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post("/create/", async (req, res) => {
    try {
        const { title, description, price, image, addedBy } = req.body;
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (addedBy !== req.session.userId) {
            return res.status(403).json({ message: "You are not logged in as this user. Access denied." });
        }

        const results = await db.createAd(title, description, price, addedBy);
        if (results.affectedRows) {
            image.forEach(async (img) => {
                await db.insertImages(img, results.insertId);
            });
        }
        res.status(200).json({ success: results.affectedRows, adId: results.insertId });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})
*/

module.exports = router;