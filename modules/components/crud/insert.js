const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        isJSON = require('is-valid-json')

        router.post('/insert/:collection?', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "")){
                res.json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 
            
                if(util.searchPermits(req.user.permits, req.params.collection, "create") === true || req.user.admin === true){
                    if(isJSON(req.body) && Object.keys(req.body).length !== 0){

                        try{

                            const insert = solar.dbInsert(
                                util.indexEncode(req.body),
                                req.params.collection,
                                config.container
                            )

                            if(insert.id){
                                res.json({ id: insert.id })
                            } else { res.json({ msg: "No se pudo ingresar los datos"})  }

                        }catch(err){
                            log.reg(deployPath, "No se pudo ingresar los datos : "+ err)
                            res.json({ msg: "No se pudo ingresar los datos"}) 
                        }
                    } else { 
                        res.json({ msg: "El JSON enviado no es Valido"}) 
                    }

                } else { 
                    log.reg(deployPath, "El usuario no tiene permisos de escritura /insert")
                    res.json({ msg: "El usuario no tiene los permisos correctos"}) 
                }
                        
            }
        })

module.exports = router;