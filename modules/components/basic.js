var express = require('express');
var router = express.Router();
const log = require("../log");
const util = require("./util");


    router.get('/', (req, res) => {

        if (!req.headers.authorization) {

            log.reg(deployPath, "Token no disponible al acceder a /")
            res.json({ message: "Tu petición no tiene cabecera de autorización" });

        } else {

            const user = util.tokenDecode(req.headers.authorization)

            if(user != 0){
                res.status(200).json({ msg: "Response OK", user: user })
            } else {
                log.reg(deployPath, "Token erroneo al acceder a / : " + JSON.stringify(req.headers.authorization))
                res.status(401).json({ msg: "Token es erroneo"})
            }

        }
        
    })

module.exports = router;
