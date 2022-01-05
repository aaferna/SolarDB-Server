
const   express = require("express"), 
        log = require("./log"), 
        exsrv = express(),
        cors = require('cors');

const jsonErrorHandler = async (err, req, res, next) => {
    log.reg(deployPath, "Se enviaron datos que no estan formateados en JSON")
    res.json({ msg : "Se enviaron datos que no estan formateados en JSON" });
}

exsrv.use(express.json())
exsrv.use(jsonErrorHandler)
exsrv.use(cors())

exsrv.use(require('./components/basic'));
exsrv.use(require('./components/crud/insert'));
exsrv.use(require('./components/crud/update'));
exsrv.use(require('./components/crud/delete'));
exsrv.use(require('./components/crud/select'));
exsrv.use(require('./components/crud/search'));
exsrv.use(require('./components/store/collections'));
exsrv.use(require('./components/store/index'));
exsrv.use(require('./components/user/select'));
exsrv.use(require('./components/user/insert'));
exsrv.use(require('./components/user/delete'));

exsrv.all('*', (req, res, next) => {
    log.reg(deployPath, `Se intento resolver el metodo ${req.originalUrl}`)
    res.status(404).json({
        msg: `No se puede resolver el metodo ${req.originalUrl}`
    });
});


module.exports = exsrv