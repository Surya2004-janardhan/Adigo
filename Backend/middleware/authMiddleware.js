const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  const authHeader = req.headers["authentication"]; // <-- fix here

  // Check if header exists and follows Bearer format
  const token = authHeader && authHeader.split(" ")[1];
  console.log("came inside for profile", token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    console.log("gegege");
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("ikkafa ");
    req.user = decoded;
    console.log("pampeysa ", decoded);
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = middleware;
