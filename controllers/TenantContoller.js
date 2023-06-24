const {
  getPropertiesForTenant,
  getPropertyRequestsForTenant
} = require("../database")


const tenantDashboardController = async (req, res) => {
  const user = await req.user
  const properties = await getPropertiesForTenant(user.id)
  const propertyRequests = await getPropertyRequestsForTenant(user.id)
  res.render("pages/tenant", {
    user: user,
    properties: properties,
    propertyRequests: propertyRequests
  })
}


module.exports = {
  tenantDashboardController
}