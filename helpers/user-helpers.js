const db = require('../config/connection')
const bcrypt = require('bcrypt')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection('userDetails').insertOne(userData).then(data => {
                response.loginStatus = true
                response.user = data
                response.popupstatus = false
                resolve(response)
                })
        })

    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
        
            let response = {}
            let user = await db.get().collection('userDetails').findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.Password).then((status) => {
                    if (status) {
                        response.loginStatus = true
                        response.user = user
                        response.popupstatus = false
                        resolve(response)
                    } else {
                        response.loginStatus = false
                        response.popupstatus = true
                        response.response = 'Password is incorrect'
                        resolve(response)
                    }
                })
            } else {
                response.loginStatus = false
                response.popupstatus = true
                response.response = 'Invalid email address'
                resolve(response)
            }
            
        })
    }
}