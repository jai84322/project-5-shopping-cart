const express = require('express');

const { getUserProf,register,loginUser,updateUser} = require('../controllers/userController')
const {createProduct,updateProduct,deleteProductById,getProduct,getProductById} = require('../controllers/productController')
const router = express.Router();
const {authentication, authorization} = require('../middleware/auth')


// user API's
router.post('/register',register)
router.post('/login',loginUser)
router.get('/user/:userId/profile', authentication, getUserProf)
router.put('/user/:userId/profile',  authentication, authorization, updateUser)


// product API's
router.post('/products', createProduct);
router.get('/products',getProduct)
router.get('/products/:productId',getProductById)
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProductById);





router.all("/*", function(req, res) {
    res.status(400).send({ msg: "No such Api found" })
})



module.exports=router;