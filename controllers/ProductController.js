//@ts-check
const {
  getPropertyById,
  getPropertyImages,
  createPropertyRequest
} = require("../database")

const propertyController = async (req, res) => {
  try {
    const { id } = req.params
    const property = await getPropertyById(id)
    const images = await getPropertyImages(id)
    res.render("pages/product-page", { property: property, images: images })

  } catch (error) {
    console.log(error)
  }
}

const propertyRequestController = async (req, res) => {
  try {
    const { id } = req.params
    const user = await req.user
    const property = await getPropertyById(id)
    console.log(property)
    const propertyRequest = await createPropertyRequest(property.id, user.id, property.landlord)
    res.redirect("/dashboard/tenant")
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  propertyController,
  propertyRequestController
}
