const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv');

app.use(session({
    name: "SESSION_ID",
    secret: process.env.session_secret,
    resave: true,
    saveUninitialized: true
}));

app.use("/api/users", require("./routes/users"))
app.use("/api/ads", require("./routes/ads"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/order"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => console.log("Server started"));

module.exports = app;