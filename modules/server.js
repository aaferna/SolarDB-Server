const   express = require("express"), 
        log = require("./log"), 
        port = config.port, 
        exsrv = express()

const jsonErrorHandler = async (err, req, res, next) => {
    log.reg(deployPath, "Se enviaron datos que no estan formateados en JSON")
    res.status(400).json({ msg : "Se enviaron datos que no estan formateados en JSON" });
}

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
exsrv.use(require('./components/insert'));
exsrv.use(require('./components/update'));

exsrv.all('*', (req, res, next) => {
    log.reg(deployPath, `Se intento resolver el metodo ${req.originalUrl}`)
    res.status(404).json({
        msg: `No se puede resolver el metodo ${req.originalUrl}`
    });
});

exsrv.listen(port, () => {

    console.log(`El servidor fue inicializado en el puerto ${port}`)

}).on('error', function (err) {

    if(err.errno === -4091) {

        log.reg(deployPath, `El puerto ${port} esta ocupado, que tal si usa ${parseInt(port) + 1}`)
        console.log(`----- El puerto ${port} esta ocupado, que tal si usa ${parseInt(port) + 1} -----`);

    } else {

        log.reg(deployPath, JSON.stringify(err))

    }

});