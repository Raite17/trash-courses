const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config");
const routes = require("./routes");
const User = require('./models/user');

//hbs settings
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("view engine", "hbs");
app.set("views", "views");
app.use(async(req, res, next) => {
    try {
        const user = await User.findById('5d583aab7615a22710f78312');
        req.user = user
        next();
    } catch (e) {
        console.log(e);
    }
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/", routes.homePage);
app.use("/add", routes.addCourse);
app.use("/courses", routes.courses);
app.use("/cart", routes.cart);
app.use("/orders", routes.orders);

//mongoose connect
async function mongooseStart() {
    try {
        await mongoose.connect(config.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'raite@gmail.com',
                name: 'Raite',
                cart: { items: [] }
            });
            await user.save();
        }
        app.listen(config.PORT, () => {
            console.log(`Сервер запущен по порту ${config.PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

mongooseStart();

// Catch Error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});