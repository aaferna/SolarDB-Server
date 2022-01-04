const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core")

        router.get('/select/unique/:collection?/:id?', tokenValidator, (req, res) => {

            if((req.params.collection === undefined) || (req.params.collection === "") || (req.params.id === undefined) || (req.params.id === "")){
                res.json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 
                if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                    try{

                        let response = util.indexDecode(solar.dbGetData(
                            req.params.id, 
                            req.params.collection,
                            config.container
                        ).pop())

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
            }    

        })

        router.get('/select/history/:collection?/:id?', tokenValidator, (req, res) => {

            if((req.params.collection === undefined) || (req.params.collection === "") || (req.params.id === undefined) || (req.params.id === "")){
                res.json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 
                if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                    try{


                        let histoDecode = [], history = solar.dbGetData(
                            req.params.id, 
                            req.params.collection,
                            config.container
                        )
                        
                        for (let index = 0; index < history.length; index++) {
                            
                            histoDecode.push(util.indexDecode(history[index]))
                            
                        }   

                        if(histoDecode){
                            res.json(histoDecode)
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
            }

        })
        
module.exports = router;