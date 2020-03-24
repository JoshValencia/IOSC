//		DECLARING VARIABLES AND REQUIRING PACKAGES & MODULES
//========================================================
require("dotenv").config();
const express = require("express"),
  path = require("path"),
  multer = require("multer"),
  flash = require("connect-flash"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  fs = require("fs"),
  cloudinary = require("cloudinary"),
  cloudinaryStorage = require("multer-storage-cloudinary");

//					APP CONFIGURATIONS
//=============================================================
//<<<<<< --------MONGODB ATLAS CONNECTION FOR ONLINE DEPLOYMENT------>>>>>>>>>>>>>
// mongoose.connect(process.env.MONGODB_URI||"localhost/IOSK",{
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// });
//<<<<<< --------MONGODB ATLAS CONNECTION FOR ONLINE DEPLOYMENT------>>>>>>>>>>>>>

//<<<<<< --------MONGODB LOCAL CONNECTION FOR OFFLINE DEPLOYMENT------>>>>>>>>>>>>>
mongoose.connect("mongodb://localhost:27017/IOSK", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
//<<<<<< --------MONGODB lOCAL CONNECTION FOR OFFLINE DEPLOYMENT------>>>>>>>>>>>>>

app.use(
  require("express-session")({
    secret: "Secret because it's secret",
    resave: false,
    saveUninitialized: false
  })
);

mongoose.set("useCreateIndex", true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(expressSanitizer());
// app.use(flash());
// app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  // res.locals.error = req.flash("error");
  // res.locals.success = req.flash("success");
  next();
});

//							STORAGE ENGINE FOR FILES
//==========================================================================
//<<<<<< --------CLOUDINARY BUCKET CONNECTION FOR ONLINE DEPLOYMENT------>>>>>>>>>>>>>
// var Storage = multer.diskStorage({
// 	filename:(req,file,cb)=>{
// 		var d = new Date();
// 		var year  = d.getFullYear();
// 		var month = d.getMonth()+1;
// 		var day = d.getDate();
// 		var date = month + "_" + day + "_" + year;
// 		cb(null,file.fieldname+"_"+date+path.extname(file.originalname));
// 	}
// });
//<<<<<< --------CLOUDINARY BUCKET CONNECTION FOR OFFLINE DEPLOYMENT------>>>>>>>>>>>>>

//<<<<<< --------LOCAL BUCKET CONNECTION FOR ONLINE DEPLOYMENT------>>>>>>>>>>>>>
var Storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    var rand = Math.floor(Math.random() * 100000000) + 8;
    cb(null, file.fieldname + "_" + rand + path.extname(file.originalname));
  }
});

var Storage1 = multer.diskStorage({
  destination: "public/uploads/attendance/",
  filename: (req, file, cb) => {
    var d = new Date();
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    var localeDate = d.toLocaleDateString(undefined, options);
    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + ":" + date.getSeconds() + ampm;
      return strTime;
    }
    var date = localeDate + "_" + formatAMPM(d);
    cb(null, file.fieldname + "_" + date + path.extname(file.originalname));
  }
});
//<<<<<< --------LOCAL BUCKET CONNECTION FOR OFFLINE DEPLOYMENT------>>>>>>>>>>>>>

var upload = multer({
  storage: Storage
}).single("file");

var upload1 = multer({
  storage: Storage1
}).single("file");

//								MONGOOSE MODELS
//==========================================================================
var UserSchema = new mongoose.Schema(
  {
    fullname: String,
    firstname: String,
    middlename: String,
    lastname: String,
    username: String,
    birthdate: String,
    gender: String,
    email: String,
    province: String,
    city: String,
    zipcode: String,
    brgy: String,
    work: String,
    isAdmin: { type: Boolean, default: false },
    photo: String,
    password: String
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);

var AttendanceSchema = new mongoose.Schema({
  employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    image: String,
    firstname: String,
    middlename: String,
    lastname: String
  },
  image: String,
  lat: String,
  lon: String,
  created: { type: Date, default: Date.now }
});

var Attendance = mongoose.model("Attendance", AttendanceSchema);

var OutletSchema = new mongoose.Schema({
  location: String,
  sku: [
    {
      number: { type: String, unique: false },
      name: { type: String, unique: false }
    }
  ]
});

var Outlet = mongoose.model("Outlet", OutletSchema);

var skuSchema = new mongoose.Schema({
  number: String,
  name: String
});

var Sku = mongoose.model("Sku", skuSchema);

//								PASSPORT CONFIG
//==========================================================================
passport.use(new LocalStrategy(User.authenticate()));
//ENCODING SESSION
passport.serializeUser(User.serializeUser());
//DECODING SESSION
passport.deserializeUser(User.deserializeUser());

//===============================FUNCTIONS============================\\
//REGEX FUNCTION
// function escapeRegex(text){
// 	return text.replace(/[-[\]{}()*+?.,\\^$!#\s]/g, "\\$&");
// };

//=======================================================
// 					RESTFUL ROUTES
//=======================================================
app.get("/", (req, res) => {
  res.render("home");
});

//>>>REGISTRATION ROUTES<<<<\\============================================================
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", upload, function(req, res) {
  // cloudinary.uploader.upload(req.file.path, function(result) {
  var firstname = req.body.firstname;
  var middlename = req.body.middlename;
  var lastname = req.body.lastname;
  var fullname = firstname + " " + middlename + " " + lastname;
  var username = req.body.username;
  var birthdate = req.body.birthdate;
  var gender = req.body.gender;
  var email = req.body.email;
  var province = req.body.province;
  var city = req.body.city;
  var zipcode = req.body.zipcode;
  var brgy = req.body.brgy;
  var work = req.body.work;
  var photo = req.file.filename;
  // photo = result.secure_url;
  var employee = {
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    fullname: fullname,
    username: username,
    birthdate: birthdate,
    gender: gender,
    email: email,
    province: province,
    city: city,
    zipcode: zipcode,
    brgy: brgy,
    work: work,
    photo: photo
  };
  if (req.body.adminCode === "10142220") {
    employee.isAdmin = true;
  }
  User.register(new User(employee), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      // req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      console.log(user);
      // req.flash("success","Your Account has been Created Successfully! Welcome " + user.username);
      res.redirect("/login");
    });
  });
});
// });

//Login Route | Login logic
app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/employee/dashboard",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//>>>LOG-OUT ROUTE<<<\\
app.get("/logout", function(req, res) {
  req.logOut();
  // req.flash("success", "You are Logged Out Successfully");
  res.redirect("/");
});

//>>>Employee Routes<<<\\
//-----------ADMIN ROUTES--------------\\
app.get("/admin/panel", (req, res) => {
  Outlet.find({}, function(err, outlet) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin-panel", { outlet: outlet });
    }
  });
});

app.post("/admin/record/add", (req, res) => {
  var location = req.body.location;
  var sku = req.body.allSku;
  var outlet1 = { location: location };
  var sku1 = [];
  for (let i = 0; i < sku.length; i++) {
    sku1.push(sku[i].number);
  }
  // console.log("BEFORE CLEARING" + "SKU1 ="+ sku1+ "SKU="+sku)
  Outlet.create(outlet1, function(err, outlet) {
    if (err) {
      console.log(err);
      res.redirect("/admin/panel");
    } else {
      Sku.find({ number: { $in: sku1 } }, function(err, skuCB) {
        if (err) {
          console.log(err);
        } else {
          skuCB.forEach(sk => {
            outlet.sku.push({ number: sk.number, name: sk.name });
          });
          outlet.save();
          res.send({ location: location, sku: skuCB });
        }
      });
    }
  });
});

app.delete("/admin/record/delete", (req, res) => {
  var locationArr = req.body.outletArr;
  var locArr = [];
  for (let i = 0; i < locationArr.length; i++) {
    locArr.push(locationArr[i].location);
  }
  Outlet.deleteMany({ location: { $in: locArr } }, function(err, outCB) {
    if (err) {
      console.log(err);
    } else {
      res.send({ outlet: locationArr });
    }
  });
});

app.put("/admin/record/update/:id", (req, res) => {
  var location = req.body.location;
  var sku = req.body.skuArr;
  var sku1 = [];
  for (let i = 0; i < sku.length; i++) {
    sku1.push(sku[i].number);
  }
  Outlet.findByIdAndUpdate(req.params.id, { location: location }, function(
    err,
    outlet
  ) {
    if (err) {
      console.log(err);
      res.redirect("/admin/panel");
    } else {
      Sku.find({ number: { $in: sku1 } }, function(err, skuCB) {
        if (err) {
          console.log(err);
        } else {
          outlet.sku = [];
          skuCB.forEach(sk => {
            outlet.sku.push({ number: sk.number, name: sk.name });
          });
          outlet.save();
          res.send({ location: location, sku: skuCB });
        }
      });
    }
  });
});

app.post("/admin/products/add", (req, res) => {
  var prodSku = req.body.prodSku;
  var prodName = req.body.prodName;
  var skuObj = { number: prodSku, name: prodName };
  Sku.create(skuObj, function(err, skuCB) {
    if (err) {
      console.log(err);
    } else {
      res.send(skuCB);
    }
  });
});

app.get("/admin/products/view", (req, res) => {
  res.render("products");
});

app.get("/admin/products/req", (req, res) => {
  Sku.find({}, function(err, sku) {
    if (err) {
      console.log(err);
    } else {
      res.send({ sku: sku });
    }
  });
});

app.get("/admin/monitor", (req, res) => {
  Attendance.find({}, function(err, data) {
    if (err) {
      console.log("ERROR :" + err);
    } else {
      res.render("monitor", { attendance: data });
    }
  });
});

app.post("/admin/search", (req, res) => {
  // const regex = new RegExp(escapeRegex(req.body.search), 'gi');
  var search = req.body.search;
  User.find(
    { fullname: { $regex: search, $options: "$i" }, isAdmin: false },
    function(err, users) {
      if (err) {
        console.log(err);
      } else {
        if (users.length < 1) {
          var noMatch = "No Match Found!";
          res.send(noMatch);
        } else {
          res.send({ users: users });
        }
      }
    }
  );
});

app.get("/admin/employee/:id", (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      req.flash("error", "Something went wrong!");
      res.redirect("/");
    } else {
      Attendance.find()
        .where("employee.id")
        .equals(user._id)
        .exec(function(err, attendance) {
          if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/admin/panel");
          } else {
            res.render("admin-employee", {
              attendance: attendance,
              user: user
            });
          }
        });
    }
  });
});

//------------------------------\\
app.get("/employee/dashboard", (req, res) => {
  if (req.user && req.user.isAdmin) {
    res.redirect("/admin/panel");
  } else {
    Outlet.find({}, (err, location) => {
      if (err) {
        console.log(err);
      } else {
        res.render("dashboard", { location: location });
      }
    });
  }
});

app.post("/employee/dashboard/sku", (req, res) => {
  var location = req.body.location;
  Outlet.findOne({ location: location }, (err, outlet) => {
    if (err) {
      console.log(err);
    } else {
      var sku = outlet.sku;
      res.send({ sku: sku });
    }
  });
});

app.get("/employee/profile/:id", (req, res) => {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      Attendance.find()
        .where("employee.id")
        .equals(user.id)
        .exec(function(err, attendance) {
          if (err) {
            console.log(err);
          } else {
            res.render("profile", { attendance: attendance });
          }
        });
    }
  });
});

app.post("/employee/timein", upload1, (req, res) => {
  var lat = req.body.lat;
  var lon = req.body.lon;
  var image = req.file.filename;
  var data = { lat: lat, lon: lon, image: image };
  Attendance.create(data, function(err, attendance) {
    if (err) {
      console.error(err);
    } else {
      attendance.employee.id = req.user._id;
      attendance.employee.username = req.user.username;
      attendance.employee.image = req.user.photo;
      attendance.employee.firstname = req.user.firstname;
      attendance.employee.middlename = req.user.middlename;
      attendance.employee.lastname = req.user.lastname;
      attendance.save();
      res.redirect("/employee/dashboard");
    }
  });
});

// SERVER INITIALIZE
//--------<<server initialization with heroku variable>>--------
// const port = process.env.PORT || 3000;
// app.listen(port,()=>{
//     console.log('Server has started at PORT 3000');
// });
//--------<<server initialization with heroku variable>>--------

const port = 3000;
app.listen(port, () => {
  console.log("Server has started at PORT 3000");
});
