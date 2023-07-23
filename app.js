const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize=require('./util/database');
const Product=require('./models/product');
const User=require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then((user)=>{
        req.user=user;
        next();
    })
    .catch(err=>{
        console.log(err)
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
User.hasMany(Product);

sequelize.sync()       //for first time setting relation we have to override existing table that is done using sync({force:true})
    .then((result)=>{
    return User.findByPk(1)})
    .then((user)=>{
    if(!user){
       return User.create({
                            name:'Sanket',
                            email:'sp@gmail.com'
                })
            }
            else
            return user;

        })
    .then((user)=>{
        app.listen(4000)
    })
    .catch(err=>{
        console.log(err)
    })