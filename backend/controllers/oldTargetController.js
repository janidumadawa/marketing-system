// backend/controllers/oldTargetController.js
const OldTarget = require('../models/OldTarget');

exports.getOldTarget = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }
    
    const targetDoc = await OldTarget.findOne({ 
      year: Number(year), 
      month,
      user: req.user._id 
    });
    
    if (!targetDoc) {
      return res.status(404).json({ message: 'Old target not found for selected month.' });
    }
    res.json({ target: targetDoc.target });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new target
exports.createOldTarget = async (req, res) => {
  try {
    const { year, month, target } = req.body;
    
    console.log('User making request:', req.user);
    console.log('Request body:', req.body);
    
    if (!year || !month || target == null) {
      return res.status(400).json({ message: 'Year, month, and target are required.' });
    }
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if target already exists
    const existingTarget = await OldTarget.findOne({
      year: Number(year),
      month,
      user: req.user._id
    });
    
    if (existingTarget) {
      return res.status(409).json({ 
        message: `Target already exists for ${month} ${year}. Use update instead.` 
      });
    }

    // Create new target
    const newTarget = await OldTarget.create({
      year: Number(year),
      month,
      target: Number(target),
      user: req.user._id
    });
    
    res.status(201).json(newTarget);
  } catch (err) {
    console.error('Error in createOldTarget:', err);
    res.status(500).json({ 
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
};

// Update existing target
exports.updateOldTarget = async (req, res) => {
  try {
    const { year, month, target } = req.body;
    
    console.log('User making request:', req.user);
    console.log('Request body:', req.body);
    
    if (!year || !month || target == null) {
      return res.status(400).json({ message: 'Year, month, and target are required.' });
    }
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const updatedTarget = await OldTarget.findOneAndUpdate(
      { year: Number(year), month, user: req.user._id },
      { target: Number(target) },
      { new: true, runValidators: true }
    );
    
    if (!updatedTarget) {
      return res.status(404).json({ 
        message: `Target not found for ${month} ${year}. Create it first.` 
      });
    }
    
    res.json(updatedTarget);
  } catch (err) {
    console.error('Error in updateOldTarget:', err);
    res.status(500).json({ 
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
};

// Keep existing function for backward compatibility (or remove if not needed)
exports.upsertOldTarget = async (req, res) => {
  try {
    const { year, month, target } = req.body;
    
    if (!year || !month || target == null) {
      return res.status(400).json({ message: 'Year, month, and target are required.' });
    }
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if target exists first
    const existingTarget = await OldTarget.findOne({
      year: Number(year),
      month,
      user: req.user._id
    });

    let result;
    
    if (existingTarget) {
      // Update existing
      existingTarget.target = Number(target);
      result = await existingTarget.save();
    } else {
      // Create new
      result = await OldTarget.create({
        year: Number(year),
        month,
        target: Number(target),
        user: req.user._id
      });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error in upsertOldTarget:', err);
    res.status(500).json({ 
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
};

exports.getAllOldTargets = async (req, res) => {
  try {
    const { year, month } = req.query;

    const filter = { user: req.user._id };
    if (year) filter.year = Number(year);
    if (month) filter.month = month;

    const targets = await OldTarget.find(filter).sort({ year: -1, month: 1 });
    res.status(200).json(targets);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get targets" });
  }
};

exports.deleteOldTarget = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }

    const result = await OldTarget.findOneAndDelete({ 
      year: Number(year), 
      month,
      user: req.user._id 
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Target not found to delete.' });
    }

    res.json({ message: `Target for ${month} ${year} deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTargetsByYear = async (req, res) => {
  try {
    const targetsByYear = await OldTarget.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$year",
          total: { $sum: "$target" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(targetsByYear);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get targets by year" });
  }
};

exports.getTargetsByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    
    if (!year) {
      return res.status(400).json({ message: 'Year parameter is required.' });
    }

    const targetsByMonth = await OldTarget.find({ 
      year: Number(year),
      user: req.user._id 
    }).sort({ month: 1 });

    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const completeData = monthOrder.map(month => {
      const found = targetsByMonth.find(item => item.month === month);
      return {
        month: month,
        target: found ? found.target : 0,
        shortMonth: month.substring(0, 3)
      };
    });

    res.status(200).json(completeData);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get targets by month" });
  }
};

exports.getAvailableYears = async (req, res) => {
  try {
    const years = await OldTarget.distinct('year', { user: req.user._id });
    const sortedYears = years.sort((a, b) => b - a);
    res.status(200).json(sortedYears);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get available years" });
  }
};