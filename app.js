const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config");
const routes = require("./routes");

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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/", routes.homePage);
app.use("/add", routes.addCourse);
app.use("/courses", routes.courses);
app.use("/cart", routes.cart);

//mongoose connect
async function mongooseStart() {
    try {
        await mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });
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