

const mysql = require("mysql2")

const pool = mysql.createPool({
  host: "containers-us-west-103.railway.app",
  user: "root",
  password: "gaCv4GRenj0eTSpdSzXM",
  database: "railway",
  port: 6179
}).promise()


async function createUser(name, password, email, phonenumber, type) {

  const queryString = `INSERT INTO users (name, password, email, phonenumber, type) values (?, ?, ?, ?, ?)`

  const result = await pool.query(queryString, [name, password, email, phonenumber, type])


  return result
}

async function getUserByEmail(email) {
  const queryString = `SELECT * FROM users WHERE email = ?`

  const result = await pool.query(queryString, [email])
  const user = result[0][0]
  return user
}

async function getUserById(id) {
  const queryString = `SELECT * FROM users WHERE id = ?`

  const result = await pool.query(queryString, [id])
  return result[0][0]
}

// Function that gets a property from property table by id
async function getPropertyById(id) {
  const queryString = `SELECT * FROM properties WHERE id = ?`

  const result = await pool.query(queryString, [id])
  const property = result[0][0]
  console.log(result)
  if (property) {
    return property
  } else {
    return null
  }
}

async function getPropertiesForLandlord(landlordId) {
  const queryString = `SELECT * FROM properties WHERE landlord = ?`

  const query = await pool.query(queryString, [landlordId])
  const properties = query[0]
  return properties
}

async function getPropertiesForTenant(tenantId) {
  const queryString = `SELECT * FROM properties WHERE tenant = ?`

  const query = await pool.query(queryString, [tenantId])
  const properties = query[0]
  return properties
}


async function createProperty(title, description, price, address, type, bedrooms, landlord) {
  const queryString = `INSERT INTO properties (title, description, price, address, type, bedrooms, landlord) values (?, ?, ?, ?, ?, ?, ?)`

  const query = await pool.query(queryString, [title, description, price, address, type, bedrooms, landlord])
  const property = query[0]
  return property
}

async function createPropertyDraft(title, description, price, address, type, bedrooms, landlord) {
  const queryString = `INSERT INTO property_drafts (title, description, price, address, type, bedrooms, landlord) values (?, ?, ?, ?, ?, ?, ?)`

  const query = await pool.query(queryString, [title, description, price, address, type, bedrooms, landlord])
  const property = query[0]
  console.log(property)
  console.log(query)
  return property
}

async function getPropertyDraftsForLandlord(landlordId) {
  const queryString = `SELECT * FROM property_drafts WHERE landlord = ?`

  const query = await pool.query(queryString, [landlordId])
  const properties = query[0]
  return properties
}

async function getPropertyDraftById(id) {
  const queryString = `SELECT * FROM property_drafts WHERE id = ?`

  const query = await pool.query(queryString, [id])
  const property = query[0][0]
  return property
}

async function deletePropertyDraftById(id) {
  const queryString = `DELETE FROM property_drafts WHERE id = ?`

  const query = await pool.query(queryString, [id])
  return query
}

async function updatePropertyDraftById(id, title, description, price, address, type, bedrooms) {
  const queryString = `UPDATE property_drafts SET title = ?, description = ?, price = ?, address = ?, type = ?, bedrooms = ? WHERE id = ?`

  const query = await pool.query(queryString, [title, description, price, address, type, bedrooms, id])
  return query
}

async function createPropertyRequest(propertyId, tenantId, landlordId) {

  const queryString = `INSERT INTO property_requests (property_id, tenant_id, landlord_id, status) values (?, ?, ?, ?)`

  const query = await pool.query(queryString, [propertyId, tenantId, landlordId, "pending"])
  const propertyRequest = query[0]
  return propertyRequest
}

async function getPropertyRequestsForLandlord(landlordId) {
  const queryString = `SELECT * FROM property_requests WHERE landlord_id = ?`

  const query = await pool.query(queryString, [landlordId])
  const propertyRequests = query[0]
  return propertyRequests
}

async function getPropertyRequestsForTenant(tenantId) {
  const queryString = `SELECT * FROM property_requests WHERE tenant_id = ?`

  const query = await pool.query(queryString, [tenantId])
  const propertyRequests = query[0]
  return propertyRequests
}

async function getPropertyRequestById(id) {
  const queryString = `SELECT * FROM property_requests WHERE id = ?`
  const query = await pool.query(queryString, [id])
  const propertyRequest = query[0][0]
  return propertyRequest
}


async function deletePropertyById(id) {
  const queryString = `DELETE FROM properties WHERE id = ?`

  const query = await pool.query(queryString, [id])
  return query
}

async function updatePropertyById(id, title, description, price, address, type, bedrooms) {
  const queryString = `UPDATE properties SET title = ?, description = ?, price = ?, address = ?, type = ?, bedrooms = ? WHERE id = ?`

  const query = await pool.query(queryString, [title, description, price, address, type, bedrooms, id])
  return query
}



async function createImageForProperty(url, property) {
  const queryString = `INSERT INTO images (url, property_id) values (?, ?)`

  const query = await pool.query(queryString, [url, property])

  return query
}



async function getPropertyImages(propertyId) {
  const queryString = `SELECT * FROM images WHERE property_id = ?`

  const query = await pool.query(queryString, [propertyId])
  const images = query[0]
  return images
}

async function getPropertyDraftImages(propertyId) {
  const queryString = `SELECT * FROM image_drafts WHERE property_draft = ?`

  const query = await pool.query(queryString, [propertyId])
  const images = query[0]
  return images
}

async function createImageDraft(url, property_draft) {
  const queryString = `INSERT INTO image_drafts (url, property_draft) values (?, ?)`

  const query = await pool.query(queryString, [url, property_draft])

  return query
}


async function getPropertyDrafts() {
  const queryString = `SELECT * FROM property_drafts`

  const query = await pool.query(queryString)
  const properties = query[0]
  return properties
}



async function createPropertyFromDraft(propertyDraftId) {
  const queryString = `INSERT INTO properties (title, description, price, address, type, bedrooms, landlord) SELECT title, description, price, address, type, bedrooms, landlord FROM property_drafts WHERE id = ?`

  const query = await pool.query(queryString, [propertyDraftId])
  console.log(query)
  return query[0]
}


async function getPropertiesLikedByUser(userId) {
  const queryString = `SELECT * FROM property_likes WHERE user_id = ?`

  const query = await pool.query(queryString, [userId])
  const properties = query[0]
  return properties
}

async function getPropertyLikesForProperty(propertyId) {
  const queryString = `SELECT * FROM property_likes WHERE property_id = ?`

  const query = await pool.query(queryString, [propertyId])

  const likes = query[0]
  return likes
}

async function createPropertyLike(propertyId, userId) {
  const queryString = `INSERT INTO property_likes (property_id, user_id) values (?, ?)`

  const query = await pool.query(queryString, [propertyId, userId])

  return query
}

async function deletePropertyLike(propertyId, userId) {
  const queryString = `DELETE FROM property_likes WHERE property_id = ? AND user_id = ?`

  const query = await pool.query(queryString, [propertyId, userId])
  return query
}

async function getEditedProperties() {
  const queryString = `SELECT * FROM properties WHERE edited = 1`

  const query = await pool.query(queryString)
  const properties = query[0]
  return properties
}

async function approveEditedProperty(propertyId) {
  const queryString = `UPDATE properties SET edited = 0 WHERE id = ?`

  const query = await pool.query(queryString, [propertyId])

  return query
}


// get all properties, order by created_at
async function getProperties() {
  const queryString = `SELECT * FROM properties ORDER BY created_at DESC`

  const query = await pool.query(queryString)

  const properties = query[0]

  return properties
}


// Delete Property Request
async function deletePropertyRequestById(id) {
  const queryString = `DELETE FROM property_requests WHERE id = ?`

  const query = await pool.query(queryString, [id])
  return query
}



async function setPropertyAsRented(propertyId, tenantId) {
  const queryString = `UPDATE properties SET tenant = ?, rented = 1 WHERE id = ?`

  const query = await pool.query(queryString, [tenantId, propertyId])

  return query
}







module.exports = {
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
  getPropertyImages,
  getPropertyDraftImages,
  createImageDraft,
  getPropertyDrafts,
  createPropertyFromDraft,
  getPropertiesLikedByUser,
  getPropertyLikesForProperty,
  getEditedProperties,
  createPropertyLike,
  deletePropertyLike,
  approveEditedProperty,
  getProperties,
  deletePropertyRequestById,
  setPropertyAsRented,
  pool
}