const express = require("express");
const route = express.Router()

route.get('/',(req,res)=>{
    res.send('это только мой мир!')
})

module.exports = route