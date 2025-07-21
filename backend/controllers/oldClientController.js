// controllers/oldClientController.js
const OldClient = require('../models/OldClient');

exports.addOldClient = async (req, res) => {
  try {
    const { clientName, amountSpent, year, month } = req.body;
    if (!clientName || !amountSpent || !year || !month) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const client = await OldClient.create({ clientName, amountSpent, year, month });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOldClients = async (req, res) => {
  try {
    const { search, year, month } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (month) filter.month = month;
    if (search) filter.clientName = { $regex: search, $options: 'i' };

    const clients = await OldClient.find(filter).sort({ year: 1, month: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.calculateTotal = async (req, res) => {
  try {
    const { year, month, search } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (month) filter.month = month;
    if (search) filter.clientName = { $regex: search, $options: 'i' };

    const result = await OldClient.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$amountSpent" } } }
    ]);

    const total = result.length > 0 ? result[0].total : 0;
    res.status(200).json({ success: true, data: { year, month, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOldClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await OldClient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOldClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await OldClient.findByIdAndDelete(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.countUniqueClients = async (req, res) => {
  try {
    const { year, month, search } = req.query;
    let match = {};
    if (year) match.year = Number(year);
    if (month) match.month = month;
    if (search) match.clientName = { $regex: search, $options: 'i' };

    const result = await OldClient.aggregate([
      { $match: match },
      { $group: { _id: "$clientName" } },
      { $count: "uniqueClientCount" }
    ]);

    const count = result.length > 0 ? result[0].uniqueClientCount : 0;
    res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//get all count of clients
exports.countAllClients = async (req, res) => {
  try {
    const { year, month, search } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (month) filter.month = month;
    if (search) filter.clientName = { $regex: search, $options: 'i' };

    const count = await OldClient.countDocuments(filter);
    res.status(200).json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get top 10 clients by total amount spent
exports.getTopClients = async (req, res) => {
  try {
    const topClients = await OldClient.aggregate([
      {
        $group: {
          _id: "$clientName",
          totalSpent: { $sum: "$amountSpent" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json(topClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total amount spent per year (for bar chart)
exports.getSalesByYear = async (req, res) => {
  try {
    const result = await OldClient.aggregate([
      {
        $group: {
          _id: "$year",
          total: { $sum: "$amountSpent" }
        }
      },
      { $sort: { _id: 1 } } // ascending by year
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
