const mongoose = require('mongoose');
require('dotenv').config();

const OldClient = require('./models/OldClient');
const OldTarget = require('./models/OldTarget');

const forceMigrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const userId = '6863a08bfcf01ac7a499bd2b';
    const userObjectId = new mongoose.Types.ObjectId(userId);

    console.log('Starting FORCE migration...');

    // Option 1: Update ALL OldClients to this user (regardless of existing user field)
    const oldClientsResult = await OldClient.updateMany(
      {}, // Empty filter - update ALL documents
      { $set: { user: userObjectId } }
    );
    console.log(`Force migrated ${oldClientsResult.modifiedCount} OldClients to user ${userId}`);

    // Option 2: Update ALL OldTargets to this user (regardless of existing user field)
    const oldTargetsResult = await OldTarget.updateMany(
      {}, // Empty filter - update ALL documents
      { $set: { user: userObjectId } }
    );
    console.log(`Force migrated ${oldTargetsResult.modifiedCount} OldTargets to user ${userId}`);

    console.log('FORCE migration completed successfully!');
    
    // Verify the migration
    const userClientsCount = await OldClient.countDocuments({ user: userObjectId });
    const userTargetsCount = await OldTarget.countDocuments({ user: userObjectId });
    
    console.log(`Verification - User now has:`);
    console.log(`- ${userClientsCount} OldClients`);
    console.log(`- ${userTargetsCount} OldTargets`);

    process.exit(0);
  } catch (error) {
    console.error('Force migration error:', error);
    process.exit(1);
  }
};

forceMigrateData();