var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const producthelp = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers'); 
let admin 


admincheck = (req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/')
  }
}

//---admin home page-----//

router.get('/', admincheck, function(req, res, next) {
  productHelpers.getProducts().then((products)=>{
    
    res.render('admin/adminpage',{products})
  })

});

//---------add product------------//

router.get('/add-product', admincheck,(req,res)=>{
  res.render('admin/add-product',{navbar:false})
})

router.post('/add-product', admincheck,(req,res)=>{
  producthelp.addProduct(req.body).then((data)=>{
    let img = req.files.Image
    img.mv('./public/product-images/' + data+'.jpg',(err)=>{
      if(err)console.log('image not saved'+err);
      else res.redirect('add-product')
    })
    
  })
})


///--------------delete----------------//

router.get('/delete/:id', admincheck,(req,res)=>{
  let Id = req.params.id
  productHelpers.deleteproduct(Id).then(()=>{
    res.redirect('/admin')
  })
})

router.get('/delete-user/:id', admincheck, (req, res) => {
  let Id = req.params.id
  userHelpers.deleteUser(Id).then(() => {
    res.redirect('/admin/user-list')
  })
})

//-----------------edit-----------//

router.get('/edit/:id', admincheck,async (req, res) => {
  let Id = req.params.id
  let product = await productHelpers.getProductDetails(Id)
    res.render('admin/edit-product',{product})
  
})


router.post('/edit-product/:id', admincheck,(req,res)=>{
  let Id =req.params.id
  productHelpers.updateProduct(Id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let img = req.files.Image
      img.mv('./public/product-images/' + Id + '.jpg')
    }
  })
})


//-----------------user details------------------//

router.get('/user-list', admincheck,(req, res) => {
  
  userHelpers.getUsers().then((users) => {

    res.render('admin/user-list', {users, navbar: false,search:false })

  })
})


router.post('/user-search', admincheck, (req, res) => {
  userHelpers.userSearch(req.body.searchkey).then((users)=>{
    res.render('admin/user-list', { users, navbar: false ,search:true})

  })
})



  

module.exports = router;
