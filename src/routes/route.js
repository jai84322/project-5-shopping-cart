const express = require('express');

const { getUserProf,register,loginUser,updateUser} = require('../controllers/userController')
const {createProduct} = require('../controllers/productController')
const router = express.Router();
const {authentication, authorization} = require('../middleware/auth')



router.post('/register',register)
router.post('/login',loginUser)
router.get('/user/:userId/profile', authentication, getUserProf)
router.put('/user/:userId/profile',  authentication, authorization, updateUser)


// product API
router.post('/products', createProduct);



router.all("/*", function(req, res) {
    res.status(400).send({ msg: "No such Api found" })
})



module.exports=router;