const TeamMember = require('../models/teamMemberModel');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dpy3mjhw5',
  api_key: '614557284489134',
  api_secret: 'lzlAhhjN7B6VkJEeZwo1M7sBD3k',
});

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team member by ID
// @route   GET /api/team/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (teamMember) {
      res.json(teamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new team member
// @route   POST /api/team
// @access  Public
const createTeamMember = async (req, res) => {
  try {
    const { name, position, experience, bio, degrees } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'team_images'
      });
      imageUrl = result.secure_url;
    }

    const teamMember = new TeamMember({
      name,
      position,
      experience,
      bio,
      image: imageUrl,
      degrees: degrees ? JSON.parse(degrees) : [],
    });

    const newTeamMember = await teamMember.save();
    res.status(201).json(newTeamMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Public
const updateTeamMember = async (req, res) => {
  try {
    const { name, position, experience, bio, degrees } = req.body;
    let imageUrl = '';

    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      if (req.file) {
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'team_images',
        });
        imageUrl = result.secure_url;

        // Delete old image from Cloudinary if it exists
        if (teamMember.image) {
          const imagePublicId = teamMember.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`team_images/${imagePublicId}`);
        }
      } else {
        // Retain old image if no new image is provided
        imageUrl = teamMember.image;
      }

      // Update team member details
      teamMember.name = name || teamMember.name;
      teamMember.position = position || teamMember.position;
      teamMember.experience = experience || teamMember.experience;
      teamMember.bio = bio || teamMember.bio;
      teamMember.image = imageUrl || teamMember.image;
      teamMember.degrees = degrees ? JSON.parse(degrees) : teamMember.degrees;

      const updatedTeamMember = await teamMember.save();
      res.json(updatedTeamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Public
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (teamMember) {
      // Optionally, you can also delete the image from Cloudinary here
      if (teamMember.image) {
        const imagePublicId = teamMember.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`team_images/${imagePublicId}`);
      }
      await TeamMember.deleteOne({ _id: req.params.id });
      res.json({ message: 'Team member removed' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get total count of team members
// @route   GET /api/team/count
// @access  Public
const getTeamMemberCount = async (req, res) => {
  try {
    const count = await TeamMember.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMemberCount,
};
