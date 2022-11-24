const { expressjwt: jwt } = require("express-jwt");

const isHostAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'payload', 
    getToken: getTokenFromHeaders
  });
   
  function getTokenFromHeaders (req) {
    console.log(req.headers)
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        console.log('console log true', req.headers.authorization.split(" ")[1])
      const token = req.headers.authorization.split(" ")[1];
      return token;
    } 
    
    return null;
  }
  
  module.exports = {
    isHostAuthenticated
  }