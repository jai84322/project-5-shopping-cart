const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { isValidObjectId } = require("../validations/userValidation")

// const Authentication = async function (req, res, next) {
//   try {
//     let token = req.headers["x-api-key"] || req.headers["x-Api-key"];
//     if (!token)
//       return res
//         .status(400)
//         .send({ status: false, msg: "Token must be present" });

//     jwt.verify(token, "project3", (error, response) => {
//       if (error) {
//         const msg =
//           error.message === "jwt expired"
//             ? "Token is expired"
//             : "Token is invalid";
//         return res.status(401).send({ status: false, msg });
//       }
//       req.headers["userId"] = response.userId;
//       next();
//     });
//   } catch (err) {
//     return res.status(500).send({ status: false, msg: err.message });
//   }
// };

const authentication = async function (req, res, next) {
    try{
      console.log("1")
        // let token = req.headers['Authoriztion']
        // let token = req.headers.Authentication
        let token = req.rawHeaders[1].split(" ")[1]
        if (!token) return res.status(401).send({ status: false, message: "token is missing" })

        
        console.log("2")
        // if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });

        let splitToken = token.split(" ")
        console.log(splitToken[0])
        console.log(splitToken[1])
        let decodedToken = jwt.decode(splitToken[0],"s-cart49")
        if(!decodedToken) return res.status(401).send({ status: false, msg: "Invalid token" });
        console.log(decodedToken)
        console.log("dd")
        let tokenValidate = jwt.verify(splitToken[0], "s-cart49")
        if(!tokenValidate) return res.status(401).send({ status: false, msg: "Invalid Authentication" });
        
        // req.headers["userId"] = decodedToken.id
        req["decodedToken"] = decodedToken.id
       
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
      }
}

const authorization = async function (req,res,next) {
  let userId = req.params.userId
  let validId = req.decodedToken

  if (!isValidObjectId(userId)) { return res.status(400).send({status:false, message:"please enter valid user Id"})}

  let checkUser = await userModel.findById(userId)
  if(!checkUser) { return res.status(404).send({status:false, message:"user not found"})}

  if (userId != validId) {return res.status(403).send({status: false, message: "you are not authorized to do this"})}

  next()
}


module.exports = { authentication, authorization };