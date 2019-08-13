const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            couseId: {
                type: Schema.Types.ObjectId,
                ref: "Courses",
                required: true
            }
        }]
    }
});

module.exports = model("User", userSchema);