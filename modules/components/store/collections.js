const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core")

        router.get('/store/list', tokenValidator, (req, res) => {

            if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                try{

                    let response = solar.dbGetIndex(
                        req.params.collection,
                        config.container
                    )

                    if(response){
                        res.json(response)
                    } else { 
                        res.json({ msg: "No se pudo encontrar los datos"})
                    }
                    
                }catch(err){
                    log.reg(deployPath, "No se pudo encontrar los datos : "+ err)
                    res.json({ msg: "No se pudo encontrar los datos"}) 
                }
             } else { 
                log.reg(deployPath, "El usuario no tiene permisos de lectura /select")
                res.json({ msg: "El usuario no tiene los permisos correctos"}) 
            }

        })

module.exports = router;