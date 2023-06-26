
const {
  getUserById,
  getPropertiesForLandlord,
  createPropertyDraft,
  getPropertyDraftsForLandlord,
  getPropertyDraftById,
  deletePropertyDraftById,
  updatePropertyDraftById,
  createImageDraft,
  getPropertyDraftImages,
  getPropertyImages,
  deletePropertyById,
  deletePropertyRequestById,
  updatePropertyById,
  getPropertyRequestById,
  getPropertyById,
  setPropertyAsRented,
  getPropertyRequestsForLandlord,


} = require("../database");



const landloardDashboardController = async (req, res) => {
  console.log("landloardDashboardController")
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

  const propertyRequests = await getPropertyRequestsForLandlord(user.id)

  const propertyRequestsWithTenant = await Promise.all(propertyRequests.map(async (propertyRequest) => {
    const tenant = await getUserById(propertyRequest.tenant_id)
    const property = await getPropertyById(propertyRequest.property_id)
    return {
      ...propertyRequest,
      tenant,
      property
    }
  }))

  console.log(propertyRequestsWithTenant)


  const context = {
    user: user,
    propertyDrafts: propertyDraftsWithImages,
    properties: propertiesWithImages,
    propertyRequests: propertyRequestsWithTenant
  }

  res.render("pages/landlord", context);
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


const approvePropertyRequestController = async (req, res) => {
  const user = await req.user
  const requestId = req.params.id
  const request = await getPropertyRequestById(requestId)
  const propertyID = request.property_id
  const property = await getPropertyById(propertyID)
  const tenant = await getUserById(request.tenant_id)
  if (property && tenant) {
    try {
      await setPropertyAsRented(propertyID, tenant.id)
      await deletePropertyRequestById(requestId)
      res.redirect("/dashboard/landloard")
    } catch (error) {
      res.redirect("/dashboard/landloard")
    }
  } else {
    res.redirect("/dashboard/landloard")
  }
}

const declinePropertyRequestController = async (req, res) => {
  const user = await req.user
  const requestId = req.params.id
  const request = await getPropertyRequestById(requestId)
  if (request) {
    try {
      await deletePropertyRequestById(requestId)
      res.redirect("/")
    } catch (error) {
      res.redirect("/")
    }
  }
}

module.exports = {
  landloardDashboardController,
  createPropertyDraftController,
  updatePropertyDraftController,
  deletePropertyDraftController,
  approvePropertyRequestController,
  declinePropertyRequestController
}