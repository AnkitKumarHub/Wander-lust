if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const cors = require('cors');


const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const paymentRoutes = require('./routes/paymentRoutes');

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view emgine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
})

store.on("error", ()=>{
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // date now return in millisec so we are setting the expiry of one week 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,   // to prevent from cross-scripting attacks
  }
};



//creating session ID and storing the cookies with expDate info in browser
app.use(session(sessionOptions));
app.use(flash())
app.use(cors())
app.use(passport.initialize()); //middleware that initializes the passport
app.use(passport.session())  //Middleware that will restore login state from a session.

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash('success')
  // console.log(res.locals.success)
  res.locals.error = req.flash('error')
  res.locals.currUser = req.user;
  next();
})

//creating a fake user with his email username and saving in the database
// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   })
//   // register is a static method and automatically checks if the username is unique 
//   let registeredUser = await User.register(fakeUser, "helloworld") //two parameters first user and then password it will be registered in DB with the password
//   res.send(registeredUser);
// })



//validate listing as middleware now in routes/listing.js


//validate review as middleware now in routes/review.js


//using listing routes
app.use("/listings" , listingRouter)

//using review routes
app.use("/listings/:id/reviews", reviewRouter )


app.use("/api", paymentRoutes);  


//using user routes
app.use("/", userRouter)


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server listening at the port 8080");
});
