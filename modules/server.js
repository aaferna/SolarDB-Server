const express = require("express")
const jwt = require('jwt-simple');
const generator = require('generate-password');
const { validate: uuidValidate } = require('uuid');
const Ajv = require("ajv")
const { v4: uuidv4 } = require('uuid');
const log = require("./log")
const config = require("../config.json")

const jsonErrorHandler = async (err, req, res, next) => {
    log.reg(deployPath, "Se enviaron datos que no estan formateados en JSON")
    res.status(400).json({ msg : "Se enviaron datos que no estan formateados en JSON" });
}

const port = config.port
const exsrv = express()
exsrv.use(express.json())
exsrv.use(jsonErrorHandler)

exsrv.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, LINK');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});


exsrv.use(require('./components/basic'));

exsrv.listen(port, () => {

    console.log('El servidor fue inicializado')

}).on('error', function (err) {

    if(err.errno === -4091) {

        log.reg(deployPath, `El puerto ${port} esta ocupado, que tal si usa ${parseInt(port) + 1}`)
        console.log(`----- El puerto ${port} esta ocupado, que tal si usa ${parseInt(port) + 1} -----`);

    } else {

        log.reg(deployPath, JSON.stringify(err))

    }

});