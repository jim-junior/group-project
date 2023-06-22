const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt")
const { checkAuthenticated } = require("./middleware/auth");
const {
  getUserByEmail,
  getUserById,
} = require("./database");
const initializePassport = require("./passport.config")
const passport = require("passport")
const flash = require("express-flash")
const { registerUser } = require("./controllers/AuthController");
const { upload } = require("./middleware/storage")
const {
  landloardDashboardController,
  createPropertyDraftController,
  updatePropertyDraftController,
  deletePropertyDraftController
} = require("./controllers/LandloardController");
const {
  adminDashboardController,
  approvePropertyDraft,
  approveEditedPropertyController
} = require("./controllers/AdminController")









const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use("/uploads/", express.static("uploads"));
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



app.post("/auth/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth?action=login",
  failureFlash: true
}))


app.post("/auth/register", registerUser);

app.get("/dashboard/tenant", checkAuthenticated, async (req, res) => {
  const user = await req.user
  res.render("pages/tenant", {
    user: user
  });
});

app.get("/dashboard/landlord", checkAuthenticated, landloardDashboardController);

app.get("/dashboard/admin", checkAuthenticated, adminDashboardController);
app.get("/dashboard/admin/property-draft/:id/approve", checkAuthenticated, approvePropertyDraft)
app.get("/dashboard/admin/property-edit/:id/approve", checkAuthenticated, approveEditedPropertyController)


app.post("/dashboard/landlord/create-property", upload.array('image', 5), createPropertyDraftController)

app.post("/dashboard/landlord/property-draft/:id/update", upload.array('image', 5), updatePropertyDraftController)

app.get("/dashboard/landlord/property-draft/:id/delete", checkAuthenticated, deletePropertyDraftController)




app.listen(3000, () => {
  console.log("Server running on port 3000");
});
