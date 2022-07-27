const productModel = require('../models/productModel');
const { isValidAddress } = require('../validations/userValidation');
const {isBodyEmpty,IsNumuric,isValidS3Url,validateEmail, isValid, isValidMobileNo, isVerifyString,isValidJSONstr,acceptFileType,isEmpty}=require('../validations/validation');
const { uploadFile } = require('./aws-work');


// ================================================================================================================================================
//                                                       ⬇️ Create Product API ⬇️
// ================================================================================================================================================

let createProduct = async function(req,res){

    try{
    let data = JSON.parse(JSON.stringify(req.body));

    // check body is empty or not
    if(isBodyEmpty(data)) return res.status(400).send({status:false, message:"Please provide required Data"}) 

    let {title, description , price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments  }=data;

    // check All Mandatory tag present or not , and it's contain proper value or not

    if(!isValid(title)) return res.status(400).send({status:false, message:"Title tag is Required"}) 
    if(!isValid(description)) return res.status(400).send({status:false, message:"Description tag is Required"}) 

    if(!isValid(price)) return res.status(400).send({status:false, message:"Price tag is Required"}) 
    if(!IsNumuric(price)) return res.status(400).send({status:false, message:"price must be a numbe"}) 

    if(currencyId){
        if(!isValid(currencyId)) return res.status(400).send({status:false, message:"CurrencyId tag is Required"}) 
        if(currencyId.toUpperCase()!="INR") return res.status(400).send({status:false, message:"Please provide currencyId only 'INR'"}) 
    }
   
   if(currencyFormat){
    if(!isValid(currencyFormat)) return res.status(400).send({status:false, message:"CurrencyFormat tag is Required"}) 
    if(currencyFormat !="₹") return res.status(400).send({status:false, message:"Only Indian Currency ₹ accepted"}) 
   }
   

    if(isFreeShipping){
        if(typeof isFreeShipping != 'boolean') return res.status(400).send({status:false, message:"isFreeShipping type must be boolean"}) 
    }

    if(style){
        if(!isValid(style)) return res.status(400).send({status:false, message:"If you are provide stype key then you have to provide some data"}) 
    }

    // declare size of an array....

    let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];

    // if(typeof availableSizes =='object')
    // if(arr.includes())
//    availableSizes= !isValidJSONstr(availableSizes)
//    console.log(availableSizes)
    // let my =[]
//    console.log(availableSizes)
//    if(typeof availableSizes == my ){
//     console.log("EHHH")
//     let n = availableSizes.length
//     for(let i=0;i<n;i++){
//         let b = arr.includes(availableSizes[i])
//         if(b =='false'){
//             console.log("YELO")
//             return res.status(400).send({ status:false, Message: `availableSizes is accept an array json like ["S", "XS", ...] !` })
//         }
//     }
//    }


if(!availableSizes) return res.status(400).send({ status: false, msg: "availableSizes should be present" })


if(availableSizes){

}


   if (!arr.includes(availableSizes)) return res.status(400).send({ status:false, Message: `availableSizes is accept an array json like ["S", "XS", ...] !` })


   if(!isValid(installments)) return res.status(400).send({status:false, message:"installments tag is required"}) 
   if(!IsNumuric(installments)) return res.status(400).send({status:false, message:"installments must be number"})

   // files concept here

   let files = req.files;
   if(files.length==0) return res.status(400).send({ status: !true, message: "productImage is required" })
   if(!acceptFileType(files[0],'image/jpeg', 'image/png'))  return res.status(400).send({ status: false, message: "we accept jpg, jpeg or png as product image only" })
   let myUrl = await uploadFile(files[0]);
//    console.log(myUrl);
   productImage=myUrl;


   // db call for title
   let isTitleExist = await productModel.findOne({title:title});
   if(isTitleExist) return res.status(409).send({status:false, message:`"${title}" title already available, Please provide unique title`});
   

   // prepare object with all requirement
   let realData = {title,description , price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments,productImage}
   
   // perform db call for creating Document
   let my= await productModel.create(realData);
   res.status(201).send({status:true, data:my})


    }catch(err){
        res.status(500).send({status:false,message:err})
    }
}
module.exports={createProduct}