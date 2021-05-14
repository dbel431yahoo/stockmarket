const mongoose = require('mongoose');
module.exports = {
    indicesScm: new mongoose.Schema({
        companyname: String,
        isincode: String,
        industry: String,
        series: String,
        symbol: String
    }),
    result: new mongoose.Schema({
        company: String,
        date: Date,
        details: String,
        purpose: String,
        symbol: String,
        sysdate: { type: Date, default: Date.now },

    })
}