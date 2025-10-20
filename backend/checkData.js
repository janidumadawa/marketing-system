const mongoose = require('mongoose');
require('dotenv').config();

const OldClient = require('./models/OldClient');
const OldTarget = require('./models/OldTarget');

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check OldClients
    const allClients = await OldClient.find({});
    console.log('\n=== OLD CLIENTS ANALYSIS ===');
    console.log(`Total OldClients: ${allClients.length}`);
    
    const clientsByUser = await OldClient.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);
    console.log('Clients by user:', clientsByUser);

    // Check OldTargets
    const allTargets = await OldTarget.find({});
    console.log('\n=== OLD TARGETS ANALYSIS ===');
    console.log(`Total OldTargets: ${allTargets.length}`);
    
    const targetsByUser = await OldTarget.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);
    console.log('Targets by user:', targetsByUser);

    // Check specific user's data
    const userId = new mongoose.Types.ObjectId('6863a08bfcf01ac7a499bd2b');
    const userClients = await OldClient.countDocuments({ user: userId });
    const userTargets = await OldTarget.countDocuments({ user: userId });
    
    console.log('\n=== USER SPECIFIC DATA ===');
    console.log(`User ${userId} has:`);
    console.log(`- ${userClients} OldClients`);
    console.log(`- ${userTargets} OldTargets`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();