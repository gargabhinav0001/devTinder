function adminAuthenticate(req, res, next) {
  const token = "TOKEN";
  const isAdminAuthenticated = token === "TOKEN"; // Replace with your actual authentication logic
  if (!isAdminAuthenticated) {
    return res.status(403).send("Access denied. Admin authentication failed.");
  }
  next();
}
function userAuthenticate(req, res, next) {
  const token = "TOKEN";
  const isUserAuthenticated = token === "TOKEN"; // Replace with your actual authentication logic
  if (!isUserAuthenticated) {
    return res.status(403).send("Access denied. Admin authentication failed.");
  }
  next();
}
module.exports = { adminAuthenticate, userAuthenticate };
