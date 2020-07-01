//-----------------------------------------------------------------REQUIREMENTS---------------------------------------------------------------------------------

const   express = require("express"),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        session = require("express-session"),
        FileStore = require("session-file-store")(session),
        uuid = require("uuid"),
        User = require("./models/Users"),
        methodOverride = require("method-override"),
        mongoose = require("mongoose"),
        publicDir = require("path").join(__dirname,"/public");

        //Requiring routes
        const   indexRoutes = require("./routes/index"),
                userRoutes = require("./routes/users"),
                groupRoutes = require("./routes/groups"),
                assignmentRoutes = require("./routes/assignments"),
                adminRoutes = require("./routes/admin"),
                classesRoutes = require("./routes/classes"),
                statusRoutes = require("./routes/status"),
                scoreboardRoutes = require("./routes/scoreboard");

//--------------------------------------------------------------------------------------------------


//----------------------------------------------------------------CONFIGURATIONS-------------------------------------------------------------------------------


//Connect Mongoose
mongoose.connect(
    "Insert mongo database link here",
    {
        useNewUrlParser: true,
        useFindAndModify: false
    }
);


//Configure passport.js to use local strategy
passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField: "password"
    },
    (email, password, done) => {
        User.findOne({email: email})
            .then(user => {
                if(!user){
                    return done(null, false, console.log("email is not registered"));
                } else {
                    if(user.password === password){
                        return done(null, user);
                    } else {
                        return done(null, false, console.log("password incorrect"));
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
));

//Initializing the app.
const app = express();

//use publid directory
app.use(express.static(publicDir));

//passport serialize/deserialize
passport.serializeUser((user, done) => {
    done(null, user.id)
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err,user);
    });
    //const user = users.filter(user => user.id === id);
    //done(null, user);
});

//Express Body Parser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Using EJS views
app.set("view engine", "ejs");

//Setting up SESSION
app.use(session({
    genid: (req) => {
        return uuid.v4();
    },
    store: new FileStore(), //This is what you'd save to the database, or where you would save stored data in the database
    secret: "ninja noodle",
    resave: false,
    saveUninitialized: true
}));

//Using passport
app.use(passport.initialize());
app.use(passport.session());

//Method override
app.use(methodOverride("_method"));

//--------------------------------------------------------------------------------------------------


//----------------------------------------------------------------ROUTES--------------------------------------------------------------------------------------

//Using correct routes!
app.use("/assignments", assignmentRoutes);
app.use("/scoreboard", scoreboardRoutes);
app.use("/classes", classesRoutes);
app.use("/status", statusRoutes);
app.use("/groups", groupRoutes);
app.use("/admin", adminRoutes),
app.use("/users", userRoutes);
app.use("/", indexRoutes);




//Need status, corrections and scoreboard

// Check if there is an admin user when server starts. If none exists create one.
User.findById({ _id: "admin" })
    .exec()
    .then(doc => {
        //console.log(doc);
        if(doc === null){
            const admin = new User({
                _id: "admin",
                firstName: "admin",
                lastName: "admin",
                email: "admin@admin.admin",
                password: "admin",
                isAdmin: true
            });
            admin.save().then(result => {console.log("Created admin");}).catch(err => console.log(err));
        }
    })
    .catch(err => {
        console.log(err);
    })




//--------------------------------------------------------------------------------------------------


//Listen on a port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));