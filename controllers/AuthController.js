const {
  createUser,
  getUserByEmail,
  getUserById,
  createPropertyDraft,
  getPropertyDraftsForLandlord,
  getPropertyDraftById,
  deletePropertyDraftById,
  updatePropertyDraftById,
  createImageDraft,
  getPropertyDraftImages,

} = require("../database");


const registerUser = async (req, res) => {
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
}





module.exports = {
  registerUser
}