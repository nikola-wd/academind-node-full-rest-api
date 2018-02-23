const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {                                          // split white space between Bearer and token
    const token = req.headers.authorization.split(" ")[1]; // token should be a Bearer authorization header
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY); // throws error if it fails that's why we use try / catch
    req.userData = decoded;
    next(); // if we successfully authenticate
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
  
};