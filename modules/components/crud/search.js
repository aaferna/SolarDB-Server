const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        isJSON = require('is-valid-json');

        router.get('/search/:collection/:id/:key/:value', tokenValidator, (req, res) => {

            if(!req.params.collection && !req.params.id){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion" })
            } 
            
            if(util.searchPermits(req.user.permits, req.params.collection, "select") === true || req.user.admin === true){
                // try{

                    let histoDecode = [], search, history = solar.dbGetData(
                        req.params.id, 
                        req.params.collection,
                        config.container
                    )

                    search = new Object();
                    search[req.params.key] = req.params.value
                    
                    for (let index = 0; index < history.length; index++) {

                        let detect, decode
                        decode = util.indexDecode(history[index])
                        detect = util.getValues(decode, req.params.key, req.params.value)
                        console.log(detect)

                        if(detect){
                            histoDecode.push(
                                {
                                    id: history[index], 
                                    search: search, 
                                    response: detect
                                }
                            )
                        }
                        
                    }   

                    if(histoDecode){
                        res.status(200).json(histoDecode)
                    } else { 
                        res.status(400).json({ msg: "No se pudo encontrar los datos"})
                    }

                // }catch(err){
                //     log.reg(deployPath, "No se pudo encontrar los datos : "+ err)
                //     res.status(500).json({ msg: "No se pudo encontrar los datos"}) 
                // }

             } else { 
                log.reg(deployPath, "El usuario no tiene permisos de lectura /select")
                res.status(401).json({ msg: "El usuario no tiene los permisos correctos"}) 
            }
                    

        })

module.exports = router;