const express = require('express')
const app = express()
const mongoose = require('mongoose');
require("dotenv").config();
// const DataTable = require('mongoose-datatable');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const url = process.env.URL;
console.log('The value of PORT is:', process.env.PORT);
const scm = require("./schemajs")
    // mongoose.plugin(DataTable.init);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const Indices = mongoose.model('Indices', scm.indicesScm);
const Result = mongoose.model('Result', scm.result);


const kitty = new Indices({
    companyname: "companyname",
    isincode: "isincode",
    industry: "industry",
    series: "series",
    symbol: "symbol"
});
kitty.save().then(() => console.log('meow'));




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/indicesm', (req, res) => {
    res.send(req.body);
    Indices.insertMany(req.body, function(err, resp) {
        res.send(resp)
    });
})
app.post('/Resultm', (req, res) => {
    res.send(req.body);
    Indices.Result(req.body, function(err, resp) {
        res.send(resp)
    });
})






app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})