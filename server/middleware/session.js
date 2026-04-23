const { v4: uuidv4 } = require('uuid');

const sessionTracker = (req, res, next) => {
  // Get or create session ID
  let sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.setHeader('X-Session-Id', sessionId);
  }
  
  req.sessionId = sessionId;
  req.userIp = req.ip || req.connection.remoteAddress;
  req.userAgent = req.headers['user-agent'];
  
  next();
};

module.exports = { sessionTracker };