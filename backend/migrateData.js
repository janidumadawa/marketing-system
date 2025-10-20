const mongoose = require('mongoose');
require('dotenv').config();

const OldClient = require('./models/OldClient');
const OldTarget = require('./models/OldTarget');

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Your first user's ID - replace with the actual ID from your database
    const userId = '6863a08bfcf01ac7a499bd2b';

    // Migrate OldClients
    const oldClientsResult = await OldClient.updateMany(
      { user: { $exists: false } },
      { $set: { user: new mongoose.Types.ObjectId(userId) } }
    );
    console.log(`Migrated ${oldClientsResult.modifiedCount} OldClients to user ${userId}`);

    // Migrate OldTargets
    const oldTargetsResult = await OldTarget.updateMany(
      { user: { $exists: false } },
      { $set: { user: new mongoose.Types.ObjectId(userId) } }
    );
    console.log(`Migrated ${oldTargetsResult.modifiedCount} OldTargets to user ${userId}`);

    console.log('Data migration completed successfully!');
    console.log(`All existing data has been assigned to user: ${userId}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateData();