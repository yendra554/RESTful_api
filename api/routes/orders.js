const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const product = require("../models/product");


//Handle incoming GET Requests to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate('product', 'name')
    .exec()
    .then((doc) => {
      res.status(200).json({
        count: doc.length,
        orders: doc.map((doc) => {
          return {
            _id: doc._id,
            product: doc.procuct,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:4100/orders/" + doc._id,
            },
          };
        }),
      });
    });
});

router.post("/", (req, res, next) => {
   product.findById(req.body.productId) 
   .then(product  =>{
    if(!product){
          return res.status(404).json({
            message: "Product not found" 

          });
    }
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });
   return  order
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
  
         message: 'Order Stored',
         createdOrder: {
           _id: result._id,
           product: result.product,
           quantity: result.quantity
         },
         request:{
          
          type: 'POST',
          url: "http://localhost:4100/orders/" + result._id,
         }
        });
  
      });
    
   })
    .catch((err) => {
      console.log(err); 
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('product')
  .exec()
  .then(order => {
    if(!order){
      res.status(404).json({
        message: "Order not found"
      })
    }
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http://localhost:4100/orders/"
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
 });

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id : req.params.orderId})
  .exec()
  .then( result => {

    res.status(200).json({

      message: "Order Deleted",
      request: {
        type: "POST",
        url: "http://localhost:4100/orders/",
        body: { productId : "ID", quantity: "Number"}
      }

    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;
