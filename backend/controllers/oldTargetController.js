const OldTarget = require('../models/OldTarget');

exports.getOldTarget = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }
    const targetDoc = await OldTarget.findOne({ year: Number(year), month });
    if (!targetDoc) {
      return res.status(404).json({ message: 'Old target not found for selected month.' });
    }
    res.json({ target: targetDoc.target });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upsertOldTarget = async (req, res) => {
  try {
    const { year, month, target } = req.body;
    if (!year || !month || target == null) {
      return res.status(400).json({ message: 'Year, month, and target are required.' });
    }
    const updated = await OldTarget.findOneAndUpdate(
      { year: Number(year), month },
      { target },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all targets, optionally filtered by year and/or month
exports.getAllOldTargets = async (req, res) => {
  try {
    const { year, month } = req.query;

    const filter = {};
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

    const result = await OldTarget.findOneAndDelete({ year: Number(year), month });
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
      {
        $group: {
          _id: "$year",
          total: { $sum: "$target" }
        }
      },
      {
        $sort: { _id: 1 } // Sort by year ascending
      }
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
      year: Number(year) 
    }).sort({ month: 1 });

    // Define month order for proper sorting
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create a complete array with all months, filling missing ones with 0
    const completeData = monthOrder.map(month => {
      const found = targetsByMonth.find(item => item.month === month);
      return {
        month: month,
        target: found ? found.target : 0,
        shortMonth: month.substring(0, 3) // For chart display (Jan, Feb, etc.)
      };
    });

    res.status(200).json(completeData);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get targets by month" });
  }
};

// Also add this helper function to get available years
exports.getAvailableYears = async (req, res) => {
  try {
    const years = await OldTarget.distinct('year');
    const sortedYears = years.sort((a, b) => b - a); // Descending order
    res.status(200).json(sortedYears);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to get available years" });
  }
};