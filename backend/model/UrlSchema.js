import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
});

export default mongoose.model('Url', UrlSchema);