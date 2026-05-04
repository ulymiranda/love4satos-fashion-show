// Token-based auth (works cross-domain — no cookies needed)
// Tokens are stored in memory; they clear when server restarts (fine for admin use)
const activeTokens = new Set();

function generateToken() {
  const token = require('crypto').randomBytes(32).toString('hex');
  activeTokens.add(token);
  return token;
}

function invalidateToken(token) {
  activeTokens.delete(token);
}

function requireAdmin(req, res, next) {
  // Accept token from Authorization header OR ?token= query param (needed for CSV download links)
  const authHeader = req.headers['authorization'] || '';
  const headerToken = authHeader.replace('Bearer ', '').trim();
  const queryToken  = (req.query.token || '').trim();
  const token = headerToken || queryToken;
  if (token && activeTokens.has(token)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

module.exports = { requireAdmin, generateToken, invalidateToken };
