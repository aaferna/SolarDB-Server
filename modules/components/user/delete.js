const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        path = require('path');

        router.delete('/user/:id?', tokenValidator, (req, res) => {

            if((req.params.id === undefined) || (req.params.id === "")){
                res.json({ msg: "Valide tener ingresado la Coleccion y el ID" }) 
            } else { 
                const container = path.join(deployPath, "/system/")
                if(req.user.admin === true){
                        try{
                            
                            const r = solar.dbDeleteData(
                                req.params.id, 
                                "users", 
                                container
                            )

                            if(r){
                                res.status(202).json({ msg: "Usuario Eliminado" })
                            } else { 
                                res.json({ msg: "No se pudo eliminar el Index"})
                            }

                        }catch(err){
                            log.reg(deployPath, "No se pudo eliminar el Index : "+ err)
                            res.json({ msg: "No se pudo eliminar el Index"}) 
                        }

                } else { 
                    log.reg(deployPath, "El usuario no tiene permisos de Borrado /delete")
                    res.json({ msg: "El usuario no tiene los permisos correctos"}) 
                }
                    
            }
        })

module.exports = router;