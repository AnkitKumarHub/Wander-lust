# PHASE-I

* Databse set Up
* REST Apis for CRUD

 
Listing Model => place(apartment, flat , house, villa, hotel)

- title  (string)
- description (string)
- image url (string)
- price (number)
- location (string)
- country (string)


* INDEX ROUTE
get request =>  "/listings"  (all listings will be displayed)

get req => "/listing/:id    (show specific listing data (view))


* Read: (Show Route)
GET req /listings/:id => return all data for this particular id

- .tolocaleString method for currency in particular country
let text = num.toLocaleString("en-IN", {style:"currency", currency:"INR"});



* Create: New & Create Route
GET req  /listings/new  => form for new listing => form submit =>  
    Post req  /listings 



* Update: Edit & Update Route
edit 
GET  /listings/:id/edit => edit form => submit

PUT  /listings/:id


* Delete: Delete Route
DELETE  /listing/:id  => delete the listing of particular id 



# Phase 1 (Part - B) 

* styling through "ejs-mate" npm package

creating footer like component which are commonly used on every page of the website so we dont have a need of recreating  the component 

creating layout folder inside views 

creating a public folder to serve the static files such like css for styling or logic of javascript for ejs file or want to serve any image

if we want to change style like bg color to beige so we just link the stylesheet to boilerplate and it will apply to all pages of website

* creating a NAVBAR
created  includes folder and then navbar.ejs for bringing the modularity in the project 



* creating FOOTER


* Styling Index
creating card for listing page
creating card inside anchor tag if we click anywhere on the card we will be redirected to show page of that particular card
creating hover effect on cards


* Styling New Listing Page


* Styling Edit Listing


* Syling Show listing



# Phase 1 (Part - C)

it is of two type -
- client side validation ( through forntend to sever ) 
- server side validation ( ensure datbase rules/ schema ) / error handle


* Form Validations (client side validation)
when we enter data in the form, the browser and/or the web server will check to see that the data is in the "Correct Format" and "within the constraints"set by the application.

* success & Failure Text
 show messages depending on success and failure in forms while submitting the form we will now required the proper data

 But there is still a vulunerability in the project and i.e. we can still send the invalid data to the server via the hopscotch or postman.

 so we required the sever side validation also!!



*** Server side validation ***

* Custom Error Handler 
if we send price as of string type through postmen we will encounter the async error

so we uses a middleware to handle the error and also use try catch block 

* Custom WrapAsync (better than try-catch block)
 created a utils folder for error- class or wrapAsync
 to handle the error through wrapAsync function and error handling middleware 

 so that server doesnot get stop 

* Custom Express Error

* Error.ejs
 To show the error in a good way styling 

* Validations for Schema(incase the request is send from postman, hopscotch)
error which depends on individual field like we send the listing object right now we are handling error only if there is no listing object but if there is listing object (title , price, location) but missed the description so to handle that error

- we can handle in 2 ways
1.  if (!req.body.listing.title){
        throw new ExpressError(400, "title is misssing")
    }  

    individual checks for each fiels

2. using Joi => The most powerful schema description language and data validator for JavaScript

with the help of joi we define the schema for server side validation

* Validation for schema (Middleware)
converting in the form of middleware


# Phase 2 (Part - A)


* creating "Reviews" Model 
    - comment  (string)
    - rating ( 1 to 5)  (number)
    - createdAt  (data,time)


* Create Reviews
1. Setting up the reviews Form
2. Submitting the Form => adding review

    POST  /listings/:id/reviews

    each reviews should be part of listings 


* Validation for reviews 
anyone can come and submit empty reviews which we offc dont want so we will come up with 
"VALIDATION FOR REVIEWS"

1. client side (form) => we will fill required fields etc
2. sever side (joi) =>  
    joi schema
    joi schmea validate function
    function was passed as middleware 


* Render reviews (to show reviews )  on show listing page


* Adding Style to review => in card form


* Deleting Reviews
    => delete button => /listing/:id/reviews/:reviewID 
    we have to delete review from "review collection" and then from "listing. review" (array) also 
    
    for deleting the review from listing.reviews (array) we will use "PULL" operator of mongo

    $pull: the $pull operatot removes from an existing array all instances of a value or values that match a specified condition

* Deleting Listing (delete Middleware for Reviews)
    what will happend to reviews if we delete lisitngs 

# Phase 2 (Part - B)

* Express Router



* Restructuring Listings  

=> through express Router 



* Restructuring Reviews
if we simply restructure the reviews we will get an error after restructure ("cannot read properties of null: reading reviews")

app.use("/listings/:id/reviews", reviews ) which is called "parent route"   the id perimeter remains in the app.js file only it doesn't get forwarded to the review.js

solution =>
router = express.Router({mergeParams: true}) 
to merge the parent route to child route basically to send id to review.js
*** read more on express router  *** 
express.Router([options])



# Phase 2 (Part - C)

* implement cookies in sessionoption 

setting the session cookie, expDate of cookies

* Using Flash



# Phase 2 (Part - D)


* User Model

Defining the user model to store the username, password, email




* Demo User
created a fake user with username and email and then using static method register we saved our fake user in the database with email username password(in the hashing form) and salt string 


* SignUp user
GET     /signup => signup form => req will go to the post /signup 


POST    /signup will register the user in DB


* Login User
GET     /login  => login form => submit on post /login
POST    /login


# Phase 2 (Part - E)

for now any random can come and create the listings so we are developing the functionality that if anyone creates the listing he/she must be logged in the portal

How to check if user is logged in??

req.isAuthenticated()

created a isLoggedIn middleware to verify on crud operation whether a user is logged in or not 
if logged in then only allowed the operation 

* Logout User

GET   /logout

* to create sign up, login, logout functionality 
in req.user => undefined => (Not Logged in) => signUp, login
            => object => (logged in) => logout

* Login after SignUp
after signup we should automatically get logged in 
so we are going to use req.login() method of passport

* post-login Page
for now when we are going to create the new listing we are getting for login but after the login process is completed we are gettng redirected to the /listings

so for this inconvenience of the user 
console.log(req)

* Listing Owner

functionality => is Authorized()
listing can be editted or deleted by the owner itself only no other person is authorized to edit or delete other listings 
same goes for review also  



* Starting with authorization
we will give edit and delete buttons to thier respective owner only 

so we will check the curr user logged in id with their respective listing owner's id and if they match then only we will provide the options 

* Authorization for listing 
protecting the routes from the postman hopscotch requests


* Setting Authorization (for reviews)
1. review => author/owner/created by

2. if anyone review any listing then the user must be logged in the platform 


# Phase 3 (Part - A) 

MVC: Model, View, Controller structure
(Implement Design Pattern for listings)

* MVC for listings in the contoller (listings.js)


* MVC for Reviews and User
 

* Router Route 


* image upload
problems:
1. the form can't send the file to the backend at this time 
raw data is being sent only for now
2.  size limit in mongo for bson data


solution:
1. to make our form capable of sending files
2. we cant save files in mongo so we will use 3rd party service cloud server => which will save files => which will give URL/link 
3. save this link in mongo


* Manipulating Form
for now we are sending only urlencoded form
enctype = "multipart/form-data"

to parse data into file type 
Multer package is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

for now we are storing into the local storage

* Cloud Setup
cloudinary & .env file
.env => to store our environment variables/credentials with format
KEY=value

* store files into the cloud
Multer Store Cloudinary (install package cloudinary, multer-storage-cloudinary)

form => backend(parse) => cloud(store) => URL/link(req.file.path) => to save link in mongodb 

* save link in Mongo


# Phase 3 (Part - B)

* edit listing image


* Image preview for edit page


* getting started with Maps
mapbox api






# Phase 3 (Part - C)

* Fixing Home Page












