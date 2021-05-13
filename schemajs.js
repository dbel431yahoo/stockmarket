const mongoose = require('mongoose');
module.exports = {
    indicesScm: new mongoose.Schema({
        companyname: String,
        isincode: String,
        industry: String,
        series: String,
        symbol: String
    })
}