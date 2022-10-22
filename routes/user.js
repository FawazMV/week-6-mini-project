const { response } = require('express');
var express = require('express');

var router = express.Router();
const productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user-helpers')
let pop = {}
let popupstatus, user, admin, usermail, signuppop


adminuser = "mvfawazmfz@gmail.com"


//-----------middlewears-------//

sessioncheck = (req, res, next) => {
    if (req.session.log) {
        res.redirect('/')
    } else {
        next()
    }
}

authmiddlewear = (req, res, next) => {
    userHelpers.doLogin(req.body).then((response) => {
        if (response.loginStatus) {
            req.session.response = response
            req.session.log = true
            user = response.user.name
            usermail = response.user.email
            next()

        } else {
            pop = response
            popupstatus = true
            res.redirect('/login')
        }
    })
}

admincheck = (req, res, next) => {
    if (adminuser === usermail) {
        admin = true
        req.session.admin = true
    } else {
        admin = false
        req.session.admin = false
    }
    next()
}







/* --------- home page. ----------*/


router.get('/', admincheck, function (req, res, next) {
    productHelpers.getProducts().then((products) => {
        if (req.session.log) {
            res.render('Userpage/user', { products, navbar: true, user, admin })
        } else {
            res.redirect('/login')
        }
    })

});


///---------------logout-----------------//

router.post('/', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})


//-----------------login-------------//

router.get('/login', sessioncheck, function (req, res) {
    res.render('login', { pop, popupstatus })
    popupstatus = false
});

router.post('/loggedin', authmiddlewear, (req, res) => {
    res.redirect('/')
})


//----------------signup ------------------//

router.get('/signup', sessioncheck, function (req, res, next) {
    res.render('signup', { signuppop });
    signuppop = null
});


router.post('/signup', (req, res, next) => {
    userHelpers.doSignup(req.body).then((response) => {

        if (response.loginStatus) {
            req.session.response = response
            req.session.log = true
            usermail = req.body.email
            user = req.body.name
            res.redirect('/')
            signuppop = null
        } else {
            signuppop = response.response

            res.redirect('/signup')
        }


    })
})








module.exports = router