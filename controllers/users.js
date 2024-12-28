const User = require("../models/user");
const { sendWelcomeEmail } = require('../emailService');

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });

    // Register the new user with the provided password
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    // Send welcome email after registration is successful
    await sendWelcomeEmail(email, username);
    
    // Log the user in automatically and redirect
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to Wanderlust");
  //still login at home page will show page not found becasue islogin middleware doesnot got triggered so local will be undefined
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};

module.exports.redirect = (req, res) => {
  res.redirect("/listings");
};