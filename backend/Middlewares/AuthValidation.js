import Joi from 'joi';

export const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        // ✅ FIX: Was min(4) — frontend requires min 6 chars.
        // When user types a 5-char password, frontend passes it but Joi
        // used to accept it (min 4), then bcrypt saved it, but now login
        // would fail because frontend blocks passwords under 6 chars.
        // Both sides must agree: min 6.
        password: Joi.string().min(6).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        // ✅ FIX: Was returning raw Joi error object which frontend
        // couldn't display — now returns a clean readable string
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }
    next();
};

export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        // ✅ FIX: Match frontend min(6)
        password: Joi.string().min(6).max(100).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false
        });
    }
    next();
};