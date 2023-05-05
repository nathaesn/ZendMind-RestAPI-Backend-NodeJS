var express = require('express')
const router = express.Router()
module.exports = router



router.get('/get', function(req, res){
    res.send("Hello")
})