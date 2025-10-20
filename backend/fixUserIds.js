const mongoose = require('mongoose');
require('dotenv').config();

const OldClient = require('./models/OldClient');
const OldTarget = require('./models/OldTarget');

const fixUserIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const correctUserId = new mongoose.Types.ObjectId('6863a08bfcf01ac7a499bd2b');

    // Find documents with different user IDs
    const wrongClientUsers = await OldClient.aggregate([
      { $match: { user: { $ne: correctUserId } } },
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    const wrongTargetUsers = await OldTarget.aggregate([
      { $match: { user: { $ne: correctUserId } } },
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    console.log('Wrong user IDs in OldClients:', wrongClientUsers);
    console.log('Wrong user IDs in OldTargets:', wrongTargetUsers);

    // Fix OldClients with wrong user IDs
    if (wrongClientUsers.length > 0) {
      const fixClients = await OldClient.updateMany(
        { user: { $ne: correctUserId } },
        { $set: { user: correctUserId } }
      );
      console.log(`Fixed ${fixClients.modifiedCount} OldClients with wrong user IDs`);
    }

    // Fix OldTargets with wrong user IDs
    if (wrongTargetUsers.length > 0) {
      const fixTargets = await OldTarget.updateMany(
        { user: { $ne: correctUserId } },
        { $set: { user: correctUserId } }
      );
      console.log(`Fixed ${fixTargets.modifiedCount} OldTargets with wrong user IDs`);
    }

    // Final counts
    const finalClientCount = await OldClient.countDocuments({ user: correctUserId });
    const finalTargetCount = await OldTarget.countDocuments({ user: correctUserId });

    console.log('\n=== FINAL COUNTS ===');
    console.log(`User ${correctUserId} now has:`);
    console.log(`- ${finalClientCount} OldClients`);
    console.log(`- ${finalTargetCount} OldTargets`);

    process.exit(0);
  } catch (error) {
    console.error('Fix user IDs error:', error);
    process.exit(1);
  }
};

fixUserIds();