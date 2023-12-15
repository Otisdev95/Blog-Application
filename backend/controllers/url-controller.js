import UrlSchema from "../model/UrlSchema.js";
import { nanoid } from 'nanoid'

export const postUrl = async (req, res, next) => {
    const { originalUrl } = req.body;

    try {
        // Checking if original URL is present
        if (!originalUrl) {
            return res.status(400).json({ message: "Fill in the Original URL" });
        }

        // Checking if original url includes 'https://' or 'http://'
        if (!originalUrl.includes('https://') && !originalUrl.includes('http://')) {
            return res.status(400).json({ message: "Invalid URL" });
        }

        // Check if the URL already exists in the database
        const existingUrl = await UrlSchema.findOne({ originalUrl });
        if (existingUrl) {
            return res.status(400).json({ message: "This URL already exists" })
        }

        const shortUrl = generateShortUrl();

        // Creating a new URL document
        const newUrl = new UrlSchema({ originalUrl, shortUrl });

        // Save the new URL
        await newUrl.save();
      
        // Respond with the saved URL
        res.json({
            originalUrl: newUrl.originalUrl,
            shortUrl: newUrl.shortUrl
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message:"Internal Server Error" });
    }
}

function generateShortUrl() {
    return nanoid(7);
}

export const getUrl = async (req, res, next) => {
    const { shortUrl } = req.body;
    // const id = req.params.shortUrl;

    try {
        // Find the URL based on the short URL ID
        const url = await UrlSchema.findOne({ shortUrl });

        // Checking if the short URL is not found
        if (!url) {
            return res.status(404).json({ message: "No URL Found for the given Input" });
        }

        res.status(200).json(url);

        // Redirect to the original URL
        // res.redirect(url.originalUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllUrls = async (req, res, next) => {
    try {
        const urls = await UrlSchema.find();
        if (!urls || urls.length === 0) {
            return res.status(404).json({ message: "No Urls Found" });
        }
        return res.status(200).json({ urls });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteUrl = async (req, res, next) => {
    const { shortUrl } = req.body;

    try {
        const existingUrl = await UrlSchema.findOneAndDelete({ shortUrl });

        if (!existingUrl) {
            return res.status(404).json({ message: "URL does not exist" });
        }

        return res.status(200).json({ message: "URL deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}