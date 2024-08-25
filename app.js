const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash")


const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view emgine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // date now return in millisec so we are setting the expiry of one week 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,   // to prevent from cross-scripting attacks
  }
};

app.get("/", (req, res) => {
  res.send("Hi I am the root");
});


//creating session ID and storing the cookies with expDate info in browser
app.use(session(sessionOptions));
app.use(flash())

app.use((req,res,next)=>{
  res.locals.success = req.flash('success')
  // console.log(res.locals.success)
  res.locals.error = req.flash('error')
  next();
})



//validate listing as middleware now in routes/listing.js


//validate review as middleware now in routes/review.js


//using listing routes
app.use("/listings" , listings)

//using review routes
app.use("/listings/:id/reviews", reviews )

// app.get("/testlisting", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         loaction: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //   res.status(statusCode).send(message);
  //   res.send("something went worng !!");
});

app.listen(8080, () => {
  console.log("server listening at the port 8080");
});
