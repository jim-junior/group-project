/** 
 * A middleware that checks if a user is authenticated
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
  */
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/auth?action=login")
}


module.exports = {
  checkAuthenticated
}