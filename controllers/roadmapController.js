// controllers/roadmapController.js
const Roadmap = require('../models/roadmapModel');

// @desc    Get all roadmaps
// @route   GET /api/roadmaps
// @access  Public
const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().populate('courseId', 'title');
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get roadmap by ID
// @route   GET /api/roadmaps/:id
// @access  Public
const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).populate('courseId', 'title');
    if (roadmap) {
      res.json(roadmap);
    } else {
      res.status(404).json({ message: 'Roadmap not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new roadmap
// @route   POST /api/roadmaps
// @access  Public
const createRoadmap = async (req, res) => {
  const { courseId, title, contents } = req.body;

  const roadmap = new Roadmap({
    courseId,
    title,
    contents,
  });

  try {
    const newRoadmap = await roadmap.save();
    res.status(201).json(newRoadmap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a roadmap
// @route   PUT /api/roadmaps/:id
// @access  Public
const updateRoadmap = async (req, res) => {
  const { courseId, title, contents } = req.body;

  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (roadmap) {
      roadmap.courseId = courseId || roadmap.courseId;
      roadmap.title = title || roadmap.title;
      roadmap.contents = contents || roadmap.contents;

      const updatedRoadmap = await roadmap.save();
      res.json(updatedRoadmap);
    } else {
      res.status(404).json({ message: 'Roadmap not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Public
const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (roadmap) {
      await Roadmap.deleteOne({ _id: req.params.id });
      res.json({ message: 'Roadmap removed' });
    } else {
      res.status(404).json({ message: 'Roadmap not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of roadmap
// @route   GET /api/roadmap/count
// @access  Public
const getRoadMapCount = async (req, res) => {
  try {
    const count = await Roadmap.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  getRoadMapCount,
};
