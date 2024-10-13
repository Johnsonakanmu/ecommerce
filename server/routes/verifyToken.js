const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization header:", authHeader); // Debugging: Check the header value
  
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("Extracted token:", token); // Debugging: Check extracted token
  
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
          console.error("Token verification error:", err); // Log verification errors
          return res.status(403).json("Token is not valid!");
        }
        req.user = user;
        next();
      });
    } else {
      console.warn("No Authorization header provided"); // Log missing headers
      return res.status(401).json("You are not authenticated!");
    }
  };

// const verifyToken = (req, res, next) => {
//     const token = req.body.authToken; // Read from the form field
  
//     if (token) {
//       jwt.verify(token, process.env.JWT_SEC, (err, user) => {
//         if (err) {
//           return res.status(403).json("Token is not valid!");
//         }
//         req.user = user;
//         next();
//       });
//     } else {
//       return res.status(401).json("You are not authenticated!");
//     }
//   };


// const verifyTokenAndAuthorization = (req, res, next)=>{
//     verifyToken(req, res, () =>{
//         if (req.user.id === req.params.id || req.user.isAdim){
//             next();
//         }else{
//             res.status(403).json("You are not authorized to access this resource!")
//         }
//     })
// }


// const verifyTokenAndAdmin = (req, res, next)=>{
//     verifyToken(req, res, () =>{
//         if (req.user.isAdmin){
//             next();
//         }else{
//             res.status(403).json("You are not authorized to access this resource!")
//         }
//     })
// }




 module.exports ={ verifyToken };