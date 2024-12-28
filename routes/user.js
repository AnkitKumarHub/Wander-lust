const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.route("/")
    .get(userController.redirect);


router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));

// router
//   .route("/login")
//   .get(userController.renderLoginForm)
//   .post(
//     saveRedirectUrl,
//     passport.authenticate("local", {
//       failureRedirect: "/login",
//       failureFlash: true,
//     }),
//     userController.login
//   );


router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, // Middleware saves the redirect URL
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    (req, res) => {
      // Redirect to the saved URL or default to '/'
      const redirectUrl = req.session.redirectUrl || "/";
      delete req.session.redirectUrl; // Clear session variable after use
      res.redirect(redirectUrl);
    }
  );


// router.get("/login", userController.renderLoginForm);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

//logout
router.get("/logout", userController.logout);

module.exports = router;
