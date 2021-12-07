const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        fs = require("fs")

        router.get('/store/:collection/latest', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "")){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else {
                if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                    try{

                        const response = fs.readFileSync(config.container+"/"+req.params.collection+'/.indx', {encoding:'utf8', flag:'r'});

                        if(response){
                            res.status(200).json({ latestID: response})
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
            }
        })

        router.get('/store/:collection/list', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "")){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else {
                if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                    try{

                        const response = solar.dbGetIndex(req.params.collection, config.container).sort(function (a, b) {  return a - b;  })

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
            }
        })

        router.get('/store/:collection/list/inserts/long', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "")){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else {
                if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                    try{

                        const response = solar.dbGetIndex(req.params.collection, config.container).sort(function (a, b) {  return a - b;  })
                        let histoDecode = []
                        

                        for (let index = 0; index < response.length; index++) {

                                history = solar.dbGetData(
                                    response[index], 
                                    req.params.collection,
                                    config.container
                                )


                                if(history){
                                
                                    histoDecode.push({
                                        id: response[index],
                                        rows: history.length
                                    })
                                    
                                }
                        }   
                        
                        if(histoDecode){
                            res.status(200).json(histoDecode)
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
            }
        })
        router.get('/store/:collection/list/inserts/data', tokenValidator, (req, res) => {
            if((req.params.collection === undefined) || (req.params.collection === "")){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else {
                if(util.searchPermits(req.user.permits, req.params.collection, "read") === true || req.user.admin === true){
                    try{

                        const response = solar.dbGetIndex(req.params.collection, config.container).sort(function (a, b) {  return a - b;  })
                        let histoDecode = []
                        

                        for (let index = 0; index < response.length; index++) {

                                let histoDecodeS = [], history = solar.dbGetData(
                                    response[index],
                                    req.params.collection,
                                    config.container
                                )
                                
                                for (let index = 0; index < history.length; index++) {
                                    histoDecodeS.push(util.indexDecode(history[index]))
                                    
                                }   

                                if(histoDecodeS){
                                    histoDecode.push({
                                        id: response[index],
                                        rows: histoDecodeS
                                    })
                                }
                        }   
                        
                        if(histoDecode){
                            res.status(200).json(histoDecode)
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
            }
        })
module.exports = router;