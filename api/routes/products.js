const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
res.status(200).json({
message: 'Handling Get request from server'
});
});

router.post('/', (req, res, next) => {
const product ={
  name: req.body.name,
  price: req.body.price
};
res.status(201).json({
message: 'Handling Post request from server',
createdProduct: product
});
});

router.get('/:productId', (req, res, next) => {
const id = req.params.productId;
if(id === 'special')
{
res.status(200).json({
message: "You discover the special Id",
id:id
});           
}
else{
  res.status(200).json({
 message: "You passes an Id"
});
}

});

router.patch('/:productId', (req, res, next) => {
res.status(200).json({
message: "Updated product"
})
});

router.delete('/:productId', (req, res, next) => {
res.status(200).json({
message: "deleted product"
})
});

module.exports = router;