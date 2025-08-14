const mysql = require("mysql2");
const express = require("express");
const app = express();
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
const path = require("path");
const req = require('express/lib/request');

const session = require("express-session");

app.use(session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));





const connection  = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'contactsdb',
    password: 'Aamir4444',
});


app.get("/login", (req, res)=> {
  res.render("login");
  });

  app.post("/login", (req, res) => {
    let data = req.body;
    console.log(data);
    

    let q2 = `SELECT * FROM logindb WHERE email = '${data.email}' AND password = '${data.password}'`;
    connection.query(q2, (err, result) => {
      let userdata = result[0];
      let contacts =   req.session.phonecontact || [];
        if (err) {
            console.log(err);
           res.render("login.ejs");
        }
         if (result.length > 0) {
            // console.log("Login success:", result);
              req.session.userdata = result[0];
    
            res.render("index.ejs", {userdata, contacts});
        }

         else {
         console.log("something is error");
            res.send(`<script>window.history.back(); alert("Email or Password not correct!");</script>`);
        }

  
    });

});


 
   app.post("/create", (req, res) => {
    let data = req.body;
    console.log(data);
          let q = `INSERT INTO logindb (id, name, email, phone, password) VALUES (?, ?, ?, ?, ?)`;

    connection.query(q, [data.id, data.name, data.email, data.phone, data.password], (err, result) => {
      if (err) {
        console.log(err);
     res.send(`<script>window.history.back(); alert("Email or phone already exists");</script>`);
       

      } else {
        console.log(result);
        res.redirect("/login");
      }
    });
  

  });


  app.post("/add", (req, res)=> {
    let data = req.body;
    let userId = req.session.userdata.id
    let userdata = req.session.userdata;
        let q2 = `INSERT INTO contactsinfo (user_id, name, phone, email) VALUES (?, ?, ?, ?)`;

         connection.query(q2, [userId, data.contactName, data.contactPhone, data.contactEmail], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });


    let   q4 = `SELECT * FROM contactsinfo WHERE user_id=${userdata.id}`
    connection.query(q4, (err, result) => {
     let contacts = result;
      req.session.phonecontact = contacts;
      if (err) {
        console.log(err);
      } else {
        res.render("index.ejs", {userdata, contacts});
        console.log(result);
      }
    });

  })

      

  //  app.post("/contact", (req, res) => {
  //   let q4 = `SELECT * FROM logindb where email = '${data.email}'`
  //   console.log(q4);

  //   let q3 = `INSERT INTO contactsinfo (id, user_id, name, phone, email) VALUES (?, ?, ?, ?, ?)`;
  //   let data3 = req.body;
  //   console.log(data3);
  //   connection.query(q3, [data3.id, data3.user_id, data3.contactName, data3.contactPhone, data3.contactEmail], (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(result);
  //       res.redirect("/login");
  //     }
  //   });
  // });
 

  
//   app.patch("/:id/edit", (req, res) => { 
//   let { id } = req.params;
//   let { user: newUser, password: formPass } = req.body;

//   let q = `SELECT * FROM user WHERE id = '${id}'`;
//   connection.query(q, (err, result) => {
//     if (err) throw err;

//     if (formPass.trim() !== result[0].password.trim()) {
//       return res.send("wrong username");
//     }

//     let q2 = `UPDATE user SET username = '${newUser}' WHERE id = '${id}'`;
//     connection.query(q2, (err, updateResult) => {
//       if (err) throw err;
//       console.log(updateResult);
//       res.redirect("/");
//     });
//   });
// });





app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



