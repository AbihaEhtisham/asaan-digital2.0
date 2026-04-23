const cron = require('node-cron');
const { query } = require('../config/database');

// Refresh materialized views every hour
const refreshMaterializedViews = async () => {
  console.log('🔄 Refreshing materialized views...');
  
  try {
    await query('REFRESH MATERIALIZED VIEW CONCURRENTLY content_gaps_mv');
    console.log('✅ content_gaps_mv refreshed');
  } catch (error) {
    console.error('❌ Failed to refresh content_gaps_mv:', error.message);
  }
  
  try {
    await query('REFRESH MATERIALIZED VIEW CONCURRENTLY tutorial_analytics_mv');
    console.log('✅ tutorial_analytics_mv refreshed');
  } catch (error) {
    console.error('❌ Failed to refresh tutorial_analytics_mv:', error.message);
  }
};

// Schedule job to run at minute 0 of every hour
cron.schedule('0 * * * *', refreshMaterializedViews);

// Run once on startup
refreshMaterializedViews();

console.log('📅 MV refresh job scheduled (every hour)');

module.exports = { refreshMaterializedViews };