import express from "express";
import { getAllUsers, getUser, signup, login } from "../controllers/user-controller.js";

const userRouter = express.Router()

userRouter.get('/', getAllUsers)

userRouter.get('/:id', getUser)

userRouter.post('/signup', signup)

userRouter.post('/login', login)

export default userRouter;