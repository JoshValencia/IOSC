//		DECLARING VARIABLES AND REQUIRING PACKAGES & MODULES		
//========================================================
const express 				= require('express'),
	  path 					= require('path'),
	  multer				= require('multer'),
	  flash                 = require('connect-flash'),
	  app 					= express(),
	  bodyParser 			= require('body-parser'),
	  mongoose 				= require('mongoose'),
	  passport 				= require('passport'),
	  LocalStrategy 		= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  methodOverride 		= require('method-override'),
	  expressSanitizer 		= require('express-sanitizer'),
	  fs					= require('fs')

//					APP CONFIGURATIONS
//=============================================================
// mongoose.connect("mongodb://localhost:27017/IOSK",{
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// });

// app.use(require('express-session')({
// 	secret: "Secret because it's secret",
// 	resave: false,
// 	saveUninitialized: false
// }));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(expressSanitizer());
// app.use(flash());
// app.use(methodOverride("_method"));
// app.use(passport.initialize());
// app.use(passport.session());

//							STORAGE ENGINE FOR FILES
//==========================================================================
var Storage = multer.diskStorage({
	destination:"public/uploads/",
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
	}
});

var upload = multer({
	storage:Storage
}).single('file');

//								MONGOOSE MODELS
//==========================================================================
// var UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,   
//     image: String,
//     email: String,
//     fullname: String,
//     age: String,
//     location: String,
//     gender: String,
//     bio: String
//     },{timestamps: true});

// UserSchema.plugin(passportLocalMongoose);

// var User = mongoose.model("User", UserSchema);




//								PASSPORT CONFIG
// //==========================================================================
// passport.use(new LocalStrategy(User.authenticate()));
// //ENCODING SESSION
// passport.serializeUser(User.serializeUser());
// //DECODING SESSION
// passport.deserializeUser(User.deserializeUser());

//=======================================================
// 					RESTFUL ROUTES 
//=======================================================
app.get('/',(req,res)=>{
    res.render('home');
});

//>>>REGISTRATION ROUTES<<<<\\============================================================
app.get("/register",function(req,res){
	res.render("register");
});

// pp.post("/register",upload,function(req,res){
// 	var username = req.body.username;
// 	var image = req.file.filename;
// 	var email =req.body.email;
// 	var fullname = req.body.fullname;
// 	var age = req.body.age;
// 	var location = req.body.location;
// 	var gender = req.body.gender;
// 	var bio = req.body.bio;
// 	var newProfile = {username:username,image:image,email:email,fullname:fullname,age:age,location:location,gender:gender,bio:bio}
// 	User.register(new User(newProfile),req.body.password, function(err,user){
// 		if(err){
// 			console.log(err);
// 			req.flash("error", err.message);
// 			return res.render("register");
// 		}
// 		passport.authenticate('local')(req,res, function(){
// 				console.log(user)
// 				req.flash("success","Your Account has been Created Successfully! Welcome " + user.username);
// 				res.redirect('/blogs');
// 			});
// 		});
// 	});a


app.listen(3000,()=>{
    console.log('Server has started at PORT 3000');
});