const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core")

        router.delete('/delete/:collection?/:id?', tokenValidator, (req, res) => {

            if((req.params.collection === undefined) || (req.params.collection === "") || (req.params.id === undefined) || (req.params.id === "")){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 

                if(util.searchPermits(req.user.permits, req.params.collection, "delete") === true || req.user.admin === true){

                        try{
                            
                            const r = solar.dbDeleteData(
                                req.params.id, 
                                req.params.collection, 
                                config.container
                            )

                            if(r){
                                res.status(202).json({ msg: "Index Eliminado" })
                            } else { 
                                res.status(400).json({ msg: "No se pudo eliminar el Index"})
                            }

                        }catch(err){
                            log.reg(deployPath, "No se pudo eliminar el Index : "+ err)
                            res.status(500).json({ msg: "No se pudo eliminar el Index"}) 
                        }

                } else { 
                    log.reg(deployPath, "El usuario no tiene permisos de Borrado /delete")
                    res.status(401).json({ msg: "El usuario no tiene los permisos correctos"}) 
                }
                    
            }
        })

module.exports = router;