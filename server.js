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


const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/auth?action=login", {
    messages: {
      error: "Please Login before accessing this Page"
    }
  })
}


app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await req.user
    res.render("pages/index", { user: user })
  } else {
    res.render("pages/index", { user: null })
  }
});


app.get("/auth", (req, res) => {
  res.render("pages/auth");
});

app.post("/auth/register", async (req, res) => {
  console.log(req.body)
  try {
    const { name, password, email, phone, type } = req.body
    const hashedPass = await bcrypt.hash(password, 10)
    createUser(name, hashedPass, email, phone, type)
    res.redirect("/auth?action=login", {
      messages: {
        success: "Successfully registered Your accout. You can login"
      }
    })
  } catch (error) {
    res.redirect("/auth", {
      messages: {
        signupError: "Error creating user"
      }
    })
  }
});


app.post("/auth/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth?action=login",
  failureFlash: true
}))



app.get("/dashboard/tenant", checkAuthenticated, async (req, res) => {
  const user = await req.user
  res.render("pages/tenant");
});

app.get("/dashboard/landlord", async (req, res) => {
  const user = await req.user
  res.render("pages/landlord", {
    user: user
  });
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
