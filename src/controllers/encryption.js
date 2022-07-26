const bcrypt = require('bcrypt');
const saltRounds = 10;

let getHashOfPassword = function(password){
    let myHash="";
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            console.log(hash)
            //   myHash= hash
            return hash
         });
          return bcrypt.hash(password,salt)
      });
      bcrypt.genSalt(sal)
     
}

module.exports={getHashOfPassword}
