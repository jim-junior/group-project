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



const landloardDashboardController = async (req, res) => {
  const user = await req.user
  // Get all property drafts for landlord with their images 
  const propertyDrafts = await getPropertyDraftsForLandlord(user.id)
  const propertyDraftsWithImages = await Promise.all(propertyDrafts.map(async (propertyDraft) => {
    const images = await getPropertyDraftImages(propertyDraft.id)
    console.log(images)
    return {
      ...propertyDraft,
      images
    }
  }))

  const properties = await getPropertiesForLandlord(user.id)
  const propertiesWithImages = await Promise.all(properties.map(async (property) => {
    const images = await getPropertyImages(property.id)
    return {
      ...property,
      images
    }
  }))


  res.render("pages/landlord", {
    user: user,
    propertyDrafts: propertyDraftsWithImages,
    properties: propertiesWithImages
  });
}


const createPropertyDraftController = async (req, res) => {
  const { title, description, price, address, type, bedrooms } = req.body
  const user = await req.user
  const images = req.files
  if (title && description && price && address && type && bedrooms && images) {

    try {
      const property = await createPropertyDraft(title, description, price, address, type, bedrooms, user.id)
      images.forEach(async (image) => {
        const imgPath = image.path
        // change image path to unix style
        const imgPathUnix = imgPath.replace(/\\/g, "/")
        // add / to the beginning of the path
        const imgPathUnixWithSlash = "/" + imgPathUnix
        await createImageDraft(imgPathUnixWithSlash, property.insertId)
      })
      res.redirect("/dashboard/landlord")
    } catch (error) {
      res.redirect("/dashboard/landlord")
    }
  } else {
    res.redirect("/dashboard/landlord")
  }
}


const updatePropertyDraftController = async (req, res) => {
  const { title, description, price, address, type, bedrooms } = req.body
  const user = await req.user
  const propertyDraftId = req.params.id
  const images = req.files
  if (title && description && price && address && type && bedrooms) {
    try {
      await updatePropertyDraftById(title, description, price, address, type, bedrooms, propertyDraftId)
      if (images) {
        images.forEach(async (image) => {
          await createImageDraft(image.path, propertyDraftId)
        })
      }
      res.redirect("/dashboard/landlord")
    } catch (error) {
      res.redirect("/dashboard/landlord")
    }
  } else {
    res.redirect("/dashboard/landlord")
  }
}

const deletePropertyDraftController = async (req, res) => {
  const user = await req.user
  const propertyDraftId = req.params.id
  const propertyDraft = await getPropertyDraftById(propertyDraftId)
  if (propertyDraft) {
    if (propertyDraft) {
      await deletePropertyDraftById(propertyDraftId)
      if (user.type === "admin") {
        res.redirect("/dashboard/admin")
      } else {
        res.redirect("/dashboard/landlord")
      }
    } else {
      if (user.type === "admin") {
        res.redirect("/dashboard/admin")
      } else {
        res.redirect("/dashboard/landlord")
      }
    }
  } else {
    if (user.type === "admin") {
      res.redirect("/dashboard/admin")
    } else {
      res.redirect("/dashboard/landlord")
    }
  }
}

module.exports = {
  landloardDashboardController,
  createPropertyDraftController,
  updatePropertyDraftController,
  deletePropertyDraftController
}