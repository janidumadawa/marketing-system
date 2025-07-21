const MonthlyTarget = require('../models/MonthlyTarget');

// Add or update monthly target
exports.upsertMonthlyTarget = async (req, res) => {
  try {
    const { year, month, target } = req.body;
    if (!year || !month || !target) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const filter = { year, month };
    const update = { target };
    const options = { upsert: true, new: true };

    const targetRecord = await MonthlyTarget.findOneAndUpdate(filter, update, options);
    res.status(201).json(targetRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get monthly target
exports.getMonthlyTarget = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const targetRecord = await MonthlyTarget.findOne({ 
      year: Number(year), 
      month 
    });

    if (!targetRecord) {
      return res.status(404).json({ message: 'Target not found for this period' });
    }

    res.json(targetRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
