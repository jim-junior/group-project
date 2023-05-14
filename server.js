const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt")
const {
  createUser,
  getUserByEmail,
  getUserById,
  getPropertiesForLandlord,
  getPropertyById,
  getPropertiesForTenant,
  createProperty,
  createPropertyDraft,
  getPropertyDraftsForLandlord,
  getPropertyDraftById,
  deletePropertyDraftById,
  updatePropertyDraftById,
  createPropertyRequest,
  getPropertyRequestsForLandlord,
  getPropertyRequestsForTenant,
  getPropertyRequestById,
  deletePropertyById,
  updatePropertyById,
  createImageForProperty,
  getPropertyImages
} = require("./database");
const initializePassport = require("./passport.config")
const passport = require("passport")
const flash = require("express-flash")
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // generate a random string of 9 characters
    const randomString = Math.random().toString(36).substring(2, 15)
    cb(null, randomString + file.originalname)
  }
})


const upload = multer({
  storage: storage
})




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

/** 
 * A middleware that checks if a user is authenticated
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
  */
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/auth?action=login")
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
  const { name, password, email, phone, type } = req.body
  // Check if all fields are filled
  if (name && password && email && phone && type) {
    // Check if email already exists
    const user = await getUserByEmail(email)
    if (user) {
      res.render("pages/auth", {
        messages: {
          signupError: "Email already exists"
        }
      })
    } else {
      try {
        // Hash password
        const hashedPass = await bcrypt.hash(password, 10)
        createUser(name, hashedPass, email, phone, type)
        res.redirect("/auth?action=login")
      } catch (error) {
        res.render("pages/auth", {
          messages: {
            signupError: "Error creating user"
          }
        })
      }
    }
  } else {
    res.render("pages/auth", {
      messages: {
        signupError: "Please fill all the fields"
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
  res.render("pages/tenant", {
    user: user
  });
});

app.get("/dashboard/landlord", checkAuthenticated, async (req, res) => {
  const user = await req.user
  // Get all property drafts for landlord with their images 
  const propertyDrafts = await getPropertyDraftsForLandlord(user.id)
  const propertyDraftsWithImages = await Promise.all(propertyDrafts.map(async (propertyDraft) => {
    const images = await getPropertyImages(propertyDraft.id)
    return {
      ...propertyDraft,
      images
    }
  }))


  res.render("pages/landlord", {
    user: user,
    propertyDrafts: propertyDraftsWithImages
  });
});



// A route that uploads a property with multiple images 
app.post("/dashboard/landlord/create-property", upload.array('image', 5), async (req, res) => {
  const { title, description, price, address, type, bedrooms } = req.body
  const user = await req.user
  const images = req.files
  if (title && description && price && address && type && bedrooms && images) {

    try {
      const property = await createPropertyDraft(title, description, price, address, type, bedrooms, user.id)
      images.forEach(async (image) => {
        await createImageForProperty(image.path, property.insertId)
      })
      res.redirect("/dashboard/landlord")
    } catch (error) {
      res.render("pages/landlord", {
        user,
        messages: {
          error: "Error creating property"
        }
      })
    }
  } else {
    res.render("pages/landlord", {
      user,
      messages: {
        error: "Please fill all the fields"
      }
    })
  }
})




app.listen(3000, () => {
  console.log("Server running on port 3000");
});
