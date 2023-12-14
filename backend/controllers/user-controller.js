import UserSchema from "../model/UserSchema.js";
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserSchema.find();
        if (!users || users.length === 0) {
            return res.status(404).json( {message: "No user found!"} );
        }
        return res.status(200).json( {users} );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUser = async (req, res, next) => {
    try {
        const getUserId = req.params.id;
        const user = await UserSchema.findById(getUserId);
        if (!user) {
            return res.status(404).json( {message: "No user found!"} );
        }
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    // Checking if the user already exists in the db
    try {
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This user already exists, login instead" });
        }

        // Else create a new user
    const hashedPassword = bcrypt.hashSync(password);
    const user = new UserSchema({ name, email, password: hashedPassword });
    
    // Save the new user's data
    await user.save();
    return res.status(201).json({user})
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    
    
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Checking if user exists
        const existingUser = await UserSchema.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist. Please sign up!" });
        } 

        // Checking if password is correct
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect username and password!" });
        }

        // Login successful
        return res.status(200).json({ message: "Login Successful!" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}