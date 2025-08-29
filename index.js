const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'our_firts_database',
    password: 'shradhakhapra54321'
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

// Home page ⏩ 

app.get("/", (req, res) => {
    let q = 'SELECT COUNT(*) as count FROM user';
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0].count;
            res.render("home", { count });
        });
    } catch(err) {
        console.log(err);
        res.send("Some error in database");
    }
});

// SHOW ROUTE 
app.get("/user", (req,res)=> {
    let q = `SELECT * FROM USER`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("showuser.ejs", {users});
        });
    } catch(err) {
        console.log(err);
        res.send("Some error in database");
    }
})

// Edit ROUTE
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = ?`;

    connection.query(q, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        let user = result[0];   // yahan har id ka apna data milega
        res.render("edit.ejs", { user });
    });
});


// Update Route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { username, password } = req.body;   // form se values aayengi

    let q = `UPDATE user SET username = ?, password = ? WHERE id = ?`;

    connection.query(q, [username, password, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        console.log(result);
        res.redirect("/user");   // update ke baad show page par bhej dena
    });
});


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
