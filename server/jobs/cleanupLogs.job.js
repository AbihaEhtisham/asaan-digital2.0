const cron = require('node-cron');
const { query } = require('../config/database');

// Archive old logs (older than 90 days)
const cleanupOldLogs = async () => {
  console.log('🧹 Cleaning up old logs...');
  
  try {
    // Archive before deleting (you can implement actual archiving logic)
    const result = await query(`
      WITH deleted AS (
        DELETE FROM query_logs
        WHERE created_at < NOW() - INTERVAL '90 days'
        RETURNING *
      )
      SELECT COUNT(*) as deleted_count FROM deleted
    `);
    
    console.log(`✅ Cleaned up ${result.rows[0].deleted_count} old logs`);
  } catch (error) {
    console.error('❌ Failed to cleanup old logs:', error.message);
  }
};

// Run daily at 3 AM
cron.schedule('0 3 * * *', cleanupOldLogs);

console.log('📅 Log cleanup job scheduled (daily at 3 AM)');

module.exports = { cleanupOldLogs };