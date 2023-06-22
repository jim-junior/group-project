const multer = require('multer');

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

module.exports = {
  upload
}