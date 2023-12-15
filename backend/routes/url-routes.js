import express from "express";
import { postUrl, getUrl, getAllUrls, deleteUrl } from "../controllers/url-controller.js";

const urlRouter = express.Router()

urlRouter.post('/', postUrl)

urlRouter.get('/:shorturl', getUrl)

urlRouter.get('/', getAllUrls)

urlRouter.delete('/', deleteUrl)

export default urlRouter;