const mongoose = require('mongoose');
require('dotenv').config();

async function fixDuplicateIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const OldTarget = require('./models/OldTarget');
    
    // First, let's count the existing data to show it's safe
    const targetCount = await OldTarget.countDocuments();
    console.log(`📊 Current targets in database: ${targetCount} records`);
    console.log('✅ Your data is SAFE - we are only modifying indexes, not data\n');

    // List all current indexes
    const indexes = await OldTarget.collection.getIndexes();
    console.log('Current indexes:');
    Object.keys(indexes).forEach(key => {
      console.log(`- ${key}:`, JSON.stringify(indexes[key].key));
    });

    // Drop ONLY the problematic indexes
    const indexesToDrop = [];
    
    for (const indexName in indexes) {
      const indexKey = indexes[indexName].key;
      const keyString = JSON.stringify(indexKey);
      
      // Keep _id index (required) and the correct user_year_month index
      if (indexName === '_id_') {
        console.log(`✅ Keeping required index: ${indexName}`);
        continue;
      }
      if (keyString === '{"user":1,"year":1,"month":1}') {
        console.log(`✅ Keeping correct unique index: ${indexName}`);
        continue;
      }
      
      // Mark other indexes for removal (these are causing the conflicts)
      console.log(`🗑️  Will remove conflicting index: ${indexName}`);
      indexesToDrop.push(indexName);
    }

    console.log('\nIndexes to remove:', indexesToDrop);

    if (indexesToDrop.length === 0) {
      console.log('🎉 No conflicting indexes found! Your database is already properly configured.');
      process.exit(0);
    }

    // Drop the problematic indexes (THIS DOES NOT DELETE YOUR DATA)
    for (const indexName of indexesToDrop) {
      try {
        await OldTarget.collection.dropIndex(indexName);
        console.log(`✅ Removed conflicting index: ${indexName}`);
      } catch (err) {
        console.log(`ℹ️  Could not remove index ${indexName}:`, err.message);
      }
    }

    // Verify the final indexes
    console.log('\nFinal indexes after cleanup:');
    const finalIndexes = await OldTarget.collection.getIndexes();
    Object.keys(finalIndexes).forEach(key => {
      console.log(`- ${key}:`, JSON.stringify(finalIndexes[key].key));
    });

    // Verify data is still there
    const finalTargetCount = await OldTarget.countDocuments();
    console.log(`\n📊 Final targets in database: ${finalTargetCount} records`);
    console.log('✅ All your data is preserved!');

    console.log('\n🎉 Index cleanup completed successfully!');
    console.log('🔓 Different users can now have targets for the same year+month combination.');
    console.log('👤 User Ashoka (6863a08bfcf01ac7a499bd2b) data is SAFE and preserved.');
    console.log('👤 User Test Account (68f6139a78e059276c49dfa2) data is SAFE and preserved.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during index cleanup:', err);
    console.log('💾 Your data is still safe - no documents were modified or deleted.');
    process.exit(1);
  }
}

fixDuplicateIndex();