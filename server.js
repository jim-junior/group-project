const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt")
const { createUser, getUserByEmail, getUserById } = require("./database");
const initializePassport = require("./passport.config")
const passport = require("passport")
const flash = require("express-flash")


const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash())
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

initializePassport(passport, getUserByEmail, getUserById)




app.get("/", (req, res) => {
  res.render("pages/index");
});


app.get("/auth", (req, res) => {
  res.render("pages/auth");
});

app.post("/auth/register", async (req, res) => {
  try {
    const { name, password, email, phonenumber, type } = req.body
    const hashedPass = await bcrypt.hash(password, 10)
    createUser(name, hashedPass, email, phonenumber, type)
    if (type === "tenant") {
      res.redirect("/dashboard/tenant")
    } else if (type === "landlord") {
      res.redirect("/dashboard/landlord")
    }
  } catch (error) {

  }
});


app.post("/auth/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/auth",
  failureFlash: true
}))


app.get("/dashboard/tenant", (req, res) => {
  res.render("pages/tenant");
});

app.get("/dashboard/landlord", (req, res) => {
  res.render("pages/landlord");
});


const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/auth")
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
