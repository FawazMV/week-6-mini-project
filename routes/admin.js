var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const producthelp = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getProducts().then((products)=>{
    res.render('admin/adminpage',{admin:true,products})
  })
  
});
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{admin:true,navbar:true})
})

router.post('/add-product',(req,res)=>{
  producthelp.addProduct(req.body,(data)=>{
    let img = req.files.Image
    img.mv('./public/product-images/' + data+'.jpg',(err)=>{
      if(err)console.log('image not saved'+err);
      else res.redirect('add-product')
    })
    
  })
})


router.get('/delete/:id',(req,res)=>{
  let Id = req.params.id
  productHelpers.deleteproduct(Id).then(()=>{
    res.redirect('/admin')
  })
})

router.get('/edit/:id',async (req, res) => {
  let Id = req.params.id
  let product = await productHelpers.getProductDetails(Id)
    res.render('admin/edit-product',{product})
  
})


router.post('/edit-product/:id',(req,res)=>{
  let Id =req.params.id
  productHelpers.updateProduct(Id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let img = req.files.Image
      img.mv('./public/product-images/' + Id + '.jpg')
    }
  })
})

module.exports = router;
