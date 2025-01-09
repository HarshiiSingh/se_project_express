const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
    .status(401)
    .send({message: 'Authorization required'});
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = JWT_SECRET.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401)
    .send({message: 'Authorization required' });
  }
  req.user = payload;
  next();
}

module.exports = auth;