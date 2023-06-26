const {
  getPropertiesForTenant,
  getPropertyRequestsForTenant,
  getPropertyImages,
  getUserById,
  getPropertyById
} = require("../database")


const tenantDashboardController = async (req, res) => {
  const user = await req.user
  const properties = await getPropertiesForTenant(user.id)
  const propertyRequests = await getPropertyRequestsForTenant(user.id)
  const propertiesWithImages = await Promise.all(properties.map(async (property) => {
    const images = await getPropertyImages(property.id)
    return {
      ...property,
      images: images
    }
  }))

  const propertyRequestsWithLandlord = await Promise.all(propertyRequests.map(async (propertyRequest) => {
    const landlord = await getUserById(propertyRequest.landlord_id)
    const property = await getPropertyById(propertyRequest.property_id)
    return {
      ...propertyRequest,
      landlord,
      property
    }
  }))

  res.render("pages/tenant", {
    user: user,
    properties: propertiesWithImages,
    propertyRequests: propertyRequestsWithLandlord
  })
}


module.exports = {
  tenantDashboardController
}