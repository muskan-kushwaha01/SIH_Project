const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ phone: req.body.phone });
        if (!user)
            return res.status(401).send({ message: "Invalid phone number or password" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(401).send({ message: "Invalid phone number or password" });

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        phone: Joi.string().required().label("Phone"),
        password: Joi.string().required().label("Password"),
    });

    return schema.validate(data);
};

module.exports = router;
