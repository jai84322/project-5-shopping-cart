const {isBodyEmpty,isValidS3Url,checkAllSizes,checkAllSizesForUpdate,removeSpaces, isValid, isValidMobileNo, isVerifyString,isValidPincode,isValidJSONstr,acceptFileType,isEmpty,validateEmail,IsNumuric} = require('../validations/validation')

const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const { isValidObjectId } = require('mongoose');
const orderModel = require('../models/orderModel');

let createOrder = async function(req,res){
    try{

        let userId = req.params.userId;

        if(!isValid(userId)) return res.status(400).send({status:false, message:"userId is not Present...."});
        if(!isValidObjectId(userId)) return res.status(400).send({status:false, message:"userId is not valid Object Id...."});

        let data = req.body;
        if(isBodyEmpty(data)) return res.status(400).send({status:false, message:"body doesn't contains Mandatory data...."});
        let {cartId,cancellable }= data;

        if(!isValid(cartId)) return res.status(400).send({status:false, message:"Cart Id is  Mandatory field...."});
        if(!isValidObjectId(cartId)) return res.status(400).send({status:false, message:"cartId is not valid Object Id...."});

        if( cancellable ||cancellable == ''){
            let bool = [true, false]
            if(!isValid(cancellable)) return res.status(400).send({status:false, message:"If cancellable key is select then you have to send data ...."});
            if(!bool.includes(cancellable)) return res.status(400).send({status:false, message:"It's contains only Boolean value [true, false] ...."});
            cancellable = cancellable;
        }

        let cart = await cartModel.findOne({userId:userId});
        if(!cart) return res.status(400).send({status:false, message:"Cart doesn't exists on this userId"});

        if(cart._id != cartId ) return res.status(400).send({status:false, message:"Invalid CartId"});

    let allItems = cart.items;
        

    let totalQuantity = allItems.reduce( function(acc, curr){ acc = acc +curr.quantity;
    return acc },0);
    console.log(totalQuantity)
    let {totalPrice,totalItems,items} = cart;

    let realObject = {userId, items, totalPrice,totalItems, totalQuantity, cancellable};

    let ans = await orderModel.create(realObject);
    
    res.status(201).send({status:true, data:ans});

    }catch(err){
        res.status(500).send({status:false, message:err.message});
    }
}

module.exports = {createOrder}




