const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        isJSON = require('is-valid-json');

        router.get('/store/list', tokenValidator, (req, res) => {

            if(util.searchPermits(req.user.permits, req.params.collection, "select") === true || req.user.admin === true){
                try{

                    let response = solar.dbGetIndex(
                        req.params.collection,
                        config.container
                    )

                    if(response){
                        res.status(200).json(response)
                    } else { 
                        res.status(400).json({ msg: "No se pudo encontrar los datos"})
                    }

                }catch(err){
                    log.reg(deployPath, "No se pudo encontrar los datos : "+ err)
                    res.status(500).json({ msg: "No se pudo encontrar los datos"}) 
                }

             } else { 
                log.reg(deployPath, "El usuario no tiene permisos de lectura /select")
                res.status(401).json({ msg: "El usuario no tiene los permisos correctos"}) 
            }

        })

module.exports = router;