const express = require("express");
const app = express();
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const config = require("./config");
const routes = require('./routes');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file-upload');

//hbs settings
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    helpers: require('./utils/hbs-helpers')
});

//Mongo sessions
const store = new MongoStore({
    collection: 'sessions',
    uri: config.MONGO_URL,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

//routes
app.use("/", routes.homePage);
app.use("/add", routes.addCourse);
app.use("/courses", routes.courses);
app.use("/cart", routes.cart);
app.use("/orders", routes.orders);
app.use("/auth", routes.auth);
app.use("/profile", routes.profile);
app.use(errorHandler);

//mongoose connect
async function mongooseStart() {
    try {
        await mongoose.connect(config.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        app.listen(config.PORT, () => {
            console.log(`Сервер запущен по порту ${config.PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

mongooseStart();