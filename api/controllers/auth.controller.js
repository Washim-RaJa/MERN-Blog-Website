import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';                // bcrypt gives problem inside a deployment
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username==='' || email==='' || password==='') {
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save();
        res.json("Singup successful !");
    } catch (error) {
        next(error);
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }
    try {
        const validUser = await User.findOne({email});
        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }

        const validPassword =  bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid Password'));
        }
        // excluding expiration time results token expiration when browser is closed i.e. one time session.
        const token = jwt.sign({ id: validUser._id},process.env.JWT_SECRET_KEY);

        // Excluding the password from response
        const { password: pwd, ...rest } = validUser._doc
        // Adding the token in cookies
        res.status(200)
            .cookie('access_token', token, { httpOnly: true, })
            .json(rest)

    } catch (error) {
        next(error)
    }
}


export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({email});

        // Signin/login Logic
        if (user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
            // excluding the password from response
            const { password, ...rest } = user._doc;
            res.status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(rest)
        }
        
        // Signup/register Logic
        else {
        const generatedPassword = Math.random().toString(36).slice(-8)                  // 36 means 0-9 & A-Z and -8 means last 8 digits
                                + Math.random().toString(36).slice(-8);

        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

        const newUser = new User({
            username: name.toLowerCase().split(" ").join('') + Math.random().toString(9).slice(-4),     // 9 means 0-9 only and -4 means last 4 digits
            email,
            password: hashedPassword,
            profilePicture: googlePhotoUrl
        })

        await newUser.save();

        const token = jwt.sign( { id: newUser._id }, process.env.JWT_SECRET_KEY);

        const { password, ...rest } = newUser._doc;
        
        res.status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json(rest)

        }
    } catch (error) {
        next(error)
    }
}