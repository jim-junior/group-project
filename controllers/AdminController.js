const express = require("express");

const {
  getPropertyDrafts,
  getPropertyDraftImages,
  createPropertyFromDraft
} = require("../database");


async function adminDashboardController(req, res) {
  const { user } = req;
  const propertyDrafts = await getPropertyDrafts();
  const propertyDraftsWithImages = await Promise.all(propertyDrafts.map(async (propertyDraft) => {
    const images = await getPropertyDraftImages(propertyDraft.id)
    //console.log(user)
    return {
      ...propertyDraft,
      images
    }
  }))

  console.log(propertyDraftsWithImages)

  res.render("pages/admin", {
    user,
    propertyDrafts: propertyDraftsWithImages
  });

}


async function approvePropertyDraft(req, res) {
  try {
    const { id } = req.params;
    const property = await createPropertyFromDraft(id);
    res.redirect("/dashboard/admin");
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }

}

module.exports = {
  adminDashboardController,
  approvePropertyDraft
};