const Link = require('../models/Links'); 

// Create a new link
exports.createLink = async (req, res) => {
    try {
        const newLink = new Link(req.body);
        const savedLink = await newLink.save();
        res.status(201).json(savedLink);
    } catch (error) {
        res.status(500).json({ message: 'Error creating link', error: error.message });
    }
};

// Get all links
exports.getAllLinks = async (req, res) => {
    try {
        const links = await Link.find();
        res.status(200).json(links);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching links', error: error.message });
    }
};

// Get a single link by ID
exports.getLinkById = async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ message: 'Link not found' });
        }
        res.status(200).json(link);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching link', error: error.message });
    }
};

// Update a link by ID
exports.updateLinkById = async (req, res) => {
    try {
        const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedLink) {
            return res.status(404).json({ message: 'Link not found' });
        }
        res.status(200).json(updatedLink);
    } catch (error) {
        res.status(500).json({ message: 'Error updating link', error: error.message });
    }
};

// Delete a link by ID
exports.deleteLinkById = async (req, res) => {
    try {
        const deletedLink = await Link.findByIdAndDelete(req.params.id);
        if (!deletedLink) {
            return res.status(404).json({ message: 'Link not found' });
        }
        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting link', error: error.message });
    }
};
