const express = require('express');
const router = express.Router();

//Handle incoming GET Requests to /orders
router.get('/', (req, res, next) => {
res.status(200).json({
message: 'Orders were fetched!'
});
});

router.post('/', (req, res, next) => {
const order ={
 productId : req.body.productId,
 quantity : req.body.quantity
}
res.status(201).json({
message: 'Orders was created!',
order : order
});
});

router.get('/:orderId', (req, res, next) => {
res.status(200).json({
message: 'Orders Details!',
orderId: req.params.orderId
});
});


router.delete('/:orderId', (req, res, next) => {
res.status(200).json({
message: 'Orders Deleted!',
orderId: req.params.orderId
});
});

module.exports = router;