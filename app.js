const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

//mongodb+srv://node-api:<password>@noderestapi.18paa23.mongodb.net/?retryWrites=true&w=majority
//  mongoose.connect('mongodb+srv://node-api:' 
// + process.env.MONGO_ATLAS_PW + 
// '@noderestapi.18paa23.mongodb.net/?retryWrites=true&w=majority');

mongoose.connect('mongodb+srv://node-api:node-api@noderestapi.18paa23.mongodb.net/?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));

app.use((req,res,next) =>{

   res.header("Access-Control-Allow-Origin", "*");
   res.header(
               "Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
   if(req.method === 'OPTIONS'){
     res.header('Access-Control-Allow-Method', 'GET,POST,DELETE,PATCH,PUT');
     return res.status(200).json({});
   }
   next();
})

//routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);





app.use( (req, res, next) => {
const error = new Error('Not found');
error.status =404;
next(error);

});



app.use( (error,req, res, next) => {
res.status(error.status || 500);
res.json({
error:{
 message: error.message
}
});
});

module.exports = app;