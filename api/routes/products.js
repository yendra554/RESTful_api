const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({

  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {

  if( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ){
    cb(null, true);
  }else{
    cb(null, false);
  }
  
  
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 *5
  },
  fileFilter: fileFilter
}); 

const router = express.Router();

router.get('/', (req, res, next) => {
Product.find().
select('_id name price productImage').
exec()
.then(doc =>{
const response = {
  count : doc.length, 
  product: doc.map(doc =>{
     return{
      _id: doc._id,
      name : doc.name,
      price: doc.price,
      productImage: doc.productImage,
      request: {
        type: 'GET',
        url: 'http://localhost:4100/products/' + doc._id

      }
     }
  })
};
  // if( doc.length >= 0){
    res.status(200).json(response);
  // }
  // else{
  //   res.status(404).json({
  //     message: "No Entery Found!"
  //   });
  // }
})
.catch( err => {

  console.log(err);
  res.status(500).json({
    error : err
  });
})
});

router.post('/', upload.single('productImage') ,checkAuth, (req, res, next) => {

const product = new Product({
  _id: new mongoose.Types.ObjectId(),
  name: req.body.name,
  price: req.body.price,
  productImage: req.file.path
});

product.save().then(result => {
  console.log(result);  
  res.status(201).json({
    message: 'Created Product Successfully',
    createdProduct: {
      name: result.name,
      price: result.price,
      request: {
        type: 'POST',
        url: 'http://localhost:4100/products/' + result._id

      }
    }
    });
})
.catch(err =>{
  console.log(err);
  res.status(500).json({
    error: err
  })
} );

});

router.get('/:productId', (req, res, next) => {
const id = req.params.productId;
Product.findById(id).select('name price _id prodctImage')
.exec()
.then(doc => {
  console.log("From Database",doc);
  if(doc){
    res.status(200).json({

      product: doc,
      request: {
        type: 'GET',
        description: 'Getting res By Id',
        url: 'http://localhost:4100/products/' + doc._id
      }
    });
  }
  else{
    res.status(404).json({
    
      message: "Id Not Found!"
    });
  }
}).
catch(err => {
  console.log(err)
  res.status(500).json({
    error: err
    });
});  
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for( const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
  .exec()
  .then( result => {
    res.status(200).json({
      message: 'Product Upadted!',
      request : {
          type: 'PATCH',
          url: 'http://localhost:4100/products/' + id
             
        }
    }
    );
  })
  .catch( err =>{
    console.log(err); 
    res.status(500).json({
      error : err
      });
  });
});

router.delete('/:productId', (req, res, next) => {

   const id = req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then( result => {
    res.status(200).json({
      message: 'Product Deleted!',
     
      request: {
          type:'POST',
          url: 'http://localhost:4100/products',
          data: {  name : result.name,
            price: result.price
          }
      }
    });
   })
   .catch( err =>{
    console.log(err);
    res.status(500).json({
      error : err
    });
   }); 
});

module.exports = router;