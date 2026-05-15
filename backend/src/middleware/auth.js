const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    //console.log(header); // check this later
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach both userId and full decoded payload
    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token invalid' });
  }
};
