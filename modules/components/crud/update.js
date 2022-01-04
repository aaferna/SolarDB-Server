const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        isJSON = require('is-valid-json')

        router.put('/update/:collection?/:id?', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "") || (req.params.id === undefined) || (req.params.id === "")){
                res.json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 
                if(util.searchPermits(req.user.permits, req.params.collection, "update") === true || req.user.admin === true){
                    if(isJSON(req.body) && Object.keys(req.body).length !== 0){

                        try{
                            
                            const r = solar.dbUpdate(
                                util.indexEncode(req.body),
                                req.params.id, 
                                req.params.collection, 
                                config.container
                            )

                            if(r.id){
                                res.json({ msg: "Actualizacion realizada" })
                            } else { 
                                res.json({ msg: "No se pudo ingresar los datos"})
                            }

                        }catch(err){
                            log.reg(deployPath, "No se pudo ingresar los datos : "+ err)
                            res.json({ msg: "No se pudo ingresar los datos"}) 
                        }

                    } else { 
                        // log.reg(deployPath, "El JSON enviado no es Valido /insert")
                        res.json({ msg: "El JSON enviado no es Valido"}) 
                    }

                } else { 
                    log.reg(deployPath, "El usuario no tiene permisos de escritura /insert")
                    res.json({ msg: "El usuario no tiene los permisos correctos"}) 
                }
            }      

        })
        router.put('/update/flush/:collection?/:id?', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "") || (req.params.id === undefined) || (req.params.id === "")){
                res.json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 
                if(util.searchPermits(req.user.permits, req.params.collection, "update") === true || req.user.admin === true){
                    if(isJSON(req.body) && Object.keys(req.body).length !== 0){

                        try{
                            
                            const r = solar.dbFlushInsert(
                                util.indexEncode(req.body),
                                req.params.id, 
                                req.params.collection, 
                                config.container
                            )

                            if(r.id){
                                res.json({ msg: "Actualizacion realizada" })
                            } else { 
                                res.json({ msg: "No se pudo ingresar los datos"})
                            }

                        }catch(err){
                            log.reg(deployPath, "No se pudo ingresar los datos : "+ err)
                            res.json({ msg: "No se pudo ingresar los datos"}) 
                        }

                    } else { 
                        // log.reg(deployPath, "El JSON enviado no es Valido /insert")
                        res.json({ msg: "El JSON enviado no es Valido"}) 
                    }

                } else { 
                    log.reg(deployPath, "El usuario no tiene permisos de escritura /insert")
                    res.json({ msg: "El usuario no tiene los permisos correctos"}) 
                }
            }      

        })
module.exports = router;