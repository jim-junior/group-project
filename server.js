const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt")
const { checkAuthenticated } = require("./middleware/auth");
const {
  getUserByEmail,
  getUserById,
  getProperties,
  getPropertyImages,
  pool
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
  deletePropertyDraftController,
  approvePropertyRequestController,
  declinePropertyRequestController
} = require("./controllers/LandloardController");
const {
  adminDashboardController,
  approvePropertyDraft,
  approveEditedPropertyController
} = require("./controllers/AdminController")
const {
  tenantDashboardController
} = require("./controllers/TenantContoller")
const {
  propertyController,
  propertyRequestController,
} = require("./controllers/ProductController")









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
    const properties = await getProperties()

    const propertiesWithImages = await Promise.all(properties.map(async (property) => {
      const images = await getPropertyImages(property.id)
      return {
        ...property,
        images: images
      }
    }))

    res.render("pages/index", {
      user: user,
      properties: propertiesWithImages
    })
  } else {
    res.render("pages/index", {
      user: null,
      properties: null
    })
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



app.get("/dashboard/landlord", checkAuthenticated, landloardDashboardController);

app.get("/dashboard/tenant", checkAuthenticated, tenantDashboardController)

app.get("/property/:id", checkAuthenticated, propertyController)
app.get("/property/:id/request", checkAuthenticated, propertyRequestController)

app.get("/dashboard/admin", checkAuthenticated, adminDashboardController);
app.get("/dashboard/admin/property-draft/:id/approve", checkAuthenticated, approvePropertyDraft)
app.get("/dashboard/admin/property-edit/:id/approve", checkAuthenticated, approveEditedPropertyController)


app.post("/dashboard/landlord/create-property", upload.array('image', 5), createPropertyDraftController)

app.post("/dashboard/landlord/property-draft/:id/update", upload.array('image', 5), updatePropertyDraftController)

app.get("/dashboard/landlord/property-draft/:id/delete", checkAuthenticated, deletePropertyDraftController)

app.get("/dashboard/landlord/property-request/:id/approve", checkAuthenticated, approvePropertyRequestController)

app.get("/dashboard/landlord/property-request/:id/decline", checkAuthenticated, declinePropertyRequestController)




app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// inform when pool is connected
pool.on('connect', () => {
  console.log('connected to the db');
})