const mysql = require("mysql");

require('dotenv');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    host: process.env.db_host,
    port: "3306"
});

let db = {};


db.getCategories = () => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id, name, NULL as "subcategory" FROM categories WHERE categoryId IS NULL
                    UNION ALL
                    SELECT c1.id, c1.name, c2.name FROM categories c1 INNER JOIN categories c2 ON c1.id = c2.categoryId;`,
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
    })
}

db.cancelOrder = (uid, oid) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM orders WHERE userId=${uid} AND timestamp=${oid}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.fetchOrderInfo = (uid, oid) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT
                        COUNT(itemId) AS amount,
                        o.id AS "key",
                        a.id,
                        a.title,
                        a.price,
                        o.userId,
                        a.addedBy,
                        (SELECT imageUrl FROM images WHERE images.itemId = a.id LIMIT 1) AS image
                    FROM ads a
                        INNER JOIN orders o ON o.itemId = a.id
                        INNER JOIN users u ON u.id = o.userId
                    WHERE u.id=${uid} AND o.timestamp = ${oid}
                    GROUP BY a.id;`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

/*
db.fetchOrder = (uid, oid) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM orders WHERE timestamp=${oid} AND userId=${uid}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}
*/


db.allOrders = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT DISTINCT timestamp AS orderId FROM orders WHERE userId = ${userId};`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


db.userByName = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id FROM users WHERE username="${username}"`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.completeOrder = (timestamp, userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO orders(userId, itemId, timestamp) SELECT userId,itemId,"${timestamp}" FROM cart WHERE cart.userId=${userId};`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.addToCart = (userId, itemId) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO cart (userId, itemId) VALUES (${userId}, ${itemId})`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.removeFromCart = (userId, itemId) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM cart WHERE userId=${userId} AND itemId=${itemId}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.clearCart = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM cart WHERE userId=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


db.cartTotal = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT SUM(a.price) as total FROM ads a INNER JOIN cart c ON c.itemId = a.id INNER JOIN users u ON u.id = c.userId WHERE u.id=${userId}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.allCart = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT
                        COUNT(itemId) AS amount,
                        c.id AS "key",
                        a.id,
                        a.title,
                        a.price,
                        c.userId,
                        a.addedBy,
                        (SELECT imageUrl FROM images WHERE images.itemId = a.id LIMIT 1) AS image
                    FROM ads a
                        INNER JOIN cart c ON c.itemId = a.id
                        INNER JOIN users u ON u.id = c.userId
                    WHERE u.id=${userId}
                    GROUP BY itemId, userId;`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}



db.allAds = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT DISTINCT images.itemId, ads.*, (SELECT imgs2.imageUrl FROM images imgs2 WHERE imgs2.itemId = images.itemId LIMIT 1) AS image FROM ads INNER JOIN images WHERE ads.id = images.itemId", (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.fetchAd = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id,title,description,price,addedBy FROM ads WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.getImages = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT imageUrl FROM images WHERE itemId=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.createAd = (title, description, price, addedBy) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO ads (title, description, price, addedBy) VALUES ("${title}", "${description}", ${price}, ${addedBy})`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.insertImages = (image, id) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO images (itemId, imageUrl) VALUES (${id}, "${image}")`, (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

db.editAd = (id, title, description, price) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE ads SET title="${title}", description="${description}", price=${price} WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            pool.query(`DELETE FROM images WHERE itemId=${id}`, (err_3, results_3) => {
                if (err_3) {
                    return reject(err_3);
                }
                return resolve(results_3);
            })
        })
    })
}

db.deleteAd = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM ads WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}


db.allUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM users", (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.updateUser = (id, firstName, lastName, contact, address, city, zipcode) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE users
                    SET 
                        first_name="${firstName}",
                        last_name="${lastName}",
                        contact="${contact}",
                        address="${address}",
                        city="${city}",
                        zipcode="${zipcode}"                  
                    WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.userInfo = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT username, email, first_name, last_name, contact, address, city, zipcode FROM users WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.updatePassword = (id, newPasswordHashed) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE users SET password="${newPasswordHashed}" WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM users WHERE id=${id}`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.matchEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT COUNT(*) AS broj FROM users WHERE email="${email}"`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
}

db.matchUser = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id, COUNT(*) AS broj, password, isConfirmed FROM users WHERE username="${username}"`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.insertUser = (username, password, email, firstName, lastName, contact, address, city, zipcode, token) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO users (username, password, email, first_name, last_name, contact, address, city, zipcode, isConfirmed, token) VALUES ('${username}', '${password}', '${email}', '${firstName}', '${lastName}', '${contact}', '${address}', '${city}', '${zipcode}', 0, '${token}')`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}

db.confirmUser = (token) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE users SET isConfirmed = 1 WHERE token = '${token}'`, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })

    })
}


module.exports = db;