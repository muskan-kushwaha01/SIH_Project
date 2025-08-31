const { required } = require("joi");
const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    farmType: {
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
    return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) =>{
    const schema = Joi.object({
        name: Joi.string().required().label("Name"),
        phone: Joi.string().required().label("Phone"),
        email: Joi.string().email().allow("").label("Email"),
        password: passwordComplexity().required().label("Password"),
        farmType: Joi.string().required().label("Farm_type"),
    });
    return schema.validate(data);
}

module.exports = {User, validate};