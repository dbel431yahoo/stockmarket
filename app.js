const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const url = process.env.URL;
const scm = require("./schemajs")
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json())

function evaluate(object) {
    if (object && object.constructor === Array) {
        for (var i = 0; i < object.length; i++) {
            object[i] = evaluate(object[i]);
        }
    } else if (object && typeof object == 'object' && Object.keys(object).length > 0) {
        if (Object.keys(object).indexOf('_eval') < 0) {
            for (var key in object) {
                object[key] = evaluate(object[key]);
            }
        } else switch (object['_eval']) {
            case 'Id':
                {
                    object = mongoose.Types.ObjectId(object['value']);
                    break;
                }
            case 'regex':
                {
                    object = new RegExp(object['value'], 'i');
                    break;
                }

        }
    }
    return object;
}
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    next();
});
app.use(express.static('public'))

const Indices = mongoose.model('Indices', scm.indicesScm);
const Result = mongoose.model('Result', scm.result);


/* app.get('/', (req, res) => {
    res.send('Hello World!')
})
 */


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/indicesfind', (req, res) => {
    var indices = Indices.find(req.body.find);
    if (req.body.limit)
        indices.limit(req.body.limit)
    if (req.body.sort)
        indices.sort(req.body.sort)
    if (req.body.select)
        indices.select(req.body.select);
    if (req.body.skip)
        indices.skip(req.body.skip)
    indices.exec(function(err, resp1) {
        Result.where(req.body.find).countDocuments(function(err, resp2) {
            res.send({ data: resp1, recordsTotal: resp2, recordsFiltered: resp2, draw: new Date().getTime() });
        })
    })
})

app.post('/indicesm', (req, res) => {
    Indices.insertMany(req.body, function(err, resp) {
        res.send(resp)
    });
})


app.post('/resultfind', (req, res) => {

    req.body.find = evaluate(req.body.find);
    console.log("req.body=>", req.body.find)

    var result = Result.find(req.body.find);
    if (req.body.limit)
        result.limit(req.body.limit)
    if (req.body.sort)
        result.sort(req.body.sort)
    if (req.body.select)
        result.select(req.body.select);
    if (req.body.skip)
        result.skip(req.body.skip)
    result.exec(function(err, resp1) {
        Result.where(req.body.find).countDocuments(function(err, resp2) {
            res.send({ data: resp1, recordsTotal: resp2, recordsFiltered: resp2, draw: new Date().getTime() });
        })
    })
})
app.post('/resultm', (req, res) => {
    Result.insertMany(req.body, function(err, resp) {
        res.send(resp)
    });
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})