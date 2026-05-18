const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Extract token from the incoming Request Header
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No security token provided.' });
  }

  try {
    // Verify token format usually arrives as "Bearer <token>"
    const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    
    // Verify the token validity using your secret key
    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Attach the verified user's ID directly to the request object
    req.user = verified;
    
    // Pass control to the next function in line (e.g., fetching dashboard data)
    next();
  } catch (err) {
    res.status(403).json({ message: 'Access Denied: Invalid token.' });
  }
};