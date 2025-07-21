const Client = require("../models/Clients");

// Add a new client with full details
exports.addClient = async (req, res) => {
  try {
    const {
      clientName,
      amountSpent,
      year,
      month,
      ads,
      contact,
      address,
      isActive,
      notes,
      logoUrl,
    } = req.body;

    if (!clientName) {
      return res.status(400).json({ error: "Client name is required" });
    }

    const client = new Client({
      clientName,
      amountSpent,
      year,
      month,
      ads: ads || [],
      contact,
      address,
      isActive: isActive !== undefined ? isActive : true,
      notes: notes || "",
      logoUrl: logoUrl || "",
    });

    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get clients with filtering and sorting
exports.getClients = async (req, res) => {
  try {
    const { search, year, month } = req.query;
    let filter = {};
    if (year) filter.year = Number(year);
    if (month) filter.month = month;
    if (search) filter.clientName = { $regex: search, $options: "i" };

    const clients = await Client.find(filter).sort({ year: 1, month: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a client by ID with all fields allowed
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Optional: Validate required fields if you want on update as well

    const client = await Client.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a client by ID
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Count unique clients by clientName
exports.countUniqueClients = async (req, res) => {
  try {
    const uniqueClients = await Client.distinct("clientName");
    res.json({ count: uniqueClients.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: Bulk delete all clients
exports.bulkDeleteClients = async (req, res) => {
  try {
    const result = await Client.deleteMany({});
    res.json({
      message: "All clients deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
