const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    playstore_link: {
        type: String,
        required: true,
        trim: true,
    },
    classplus_link: {
        type: String,
        required: true,
        trim: true,
    },
    mock_link: {
        type: String,
        required: true,
        trim: true,
    },
    pricing_link: {
        type: String,
        required: true,
        trim: true,
    },
    assessment_link: {
        type: String,
        required: true,
        trim: true,
    },
    portal_link: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
