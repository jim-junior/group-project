

const {
  getPropertyDrafts,
  getPropertyDraftImages,
  createPropertyFromDraft,
  deletePropertyDraftById,
  getEditedProperties,
  getPropertyImages,
  approveEditedProperty
} = require("../database");


/** 
* @param {import("express").Request} req - 
* @param {import("express").Response} res - 
*/
async function adminDashboardController(req, res) {
  const { user } = req;
  const propertyDrafts = await getPropertyDrafts();
  const propertyDraftsWithImages = await Promise.all(propertyDrafts.map(async (propertyDraft) => {
    const images = await getPropertyDraftImages(propertyDraft.id)

    return {
      ...propertyDraft,
      images
    }
  }))

  const editedProperties = await getEditedProperties();
  const editedPropertiesWithImages = await Promise.all(editedProperties.map(async (editedProperty) => {
    const images = await getPropertyImages(editedProperty.id)

    return {
      ...editedProperty,
      images
    }
  }))



  res.render("pages/admin", {
    user,
    propertyDrafts: propertyDraftsWithImages,
    editedProperties: editedPropertiesWithImages
  });

}


async function approvePropertyDraft(req, res) {
  try {
    const { id } = req.params;
    const property = await createPropertyFromDraft(id);
    const propertyDraft = await deletePropertyDraftById(id);
    res.redirect("/dashboard/admin");
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }

}


async function approveEditedPropertyController(req, res) {
  try {
    const { id } = req.params;
    const property = await approveEditedProperty(id);
    res.redirect("/dashboard/admin");
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}



module.exports = {
  adminDashboardController,
  approvePropertyDraft,
  approveEditedPropertyController
};