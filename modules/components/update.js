const   express = require('express'), 
        router = express.Router(), 
        log = require("../log"), 
        util = require("./util"),
        solar = require("solardb-core"),
        jwt = require('jwt-simple'),
        isJSON = require('is-valid-json');


router.put('/update/:collection/:id', tokenValidator, (req, res) => {

    if(!req.params.collection && !req.params.id){
        res.status(400).json({ msg: "Valide tener ingresado la Coleccion" })
    } 
    
    if(util.searchPermits(req.user.permits, req.params.collection, "create") === true || req.user.admin === true){
        if(isJSON(req.body) && Object.keys(req.body).length !== 0){

            try{
                
                const r = solar.dbUpdate(

                    jwt.encode(req.body, config.hindex), 
                    req.params.id, 
                    req.params.collection, 
                    config.container

                )

                if(r.id){
                    res.status(201).json({ msg: "Actualizacion realizada" })
                } else { 
                    res.status(400).json({ msg: "No se pudo ingresar los datos"})
                }

            }catch(err){
                log.reg(deployPath, "No se pudo ingresar los datos : "+ err)
                res.status(500).json({ msg: "No se pudo ingresar los datos"}) 
            }

        } else { 
            // log.reg(deployPath, "El JSON enviado no es Valido /insert")
            res.status(400).json({ msg: "El JSON enviado no es Valido"}) 
        }

    } else { 
        log.reg(deployPath, "El usuario no tiene permisos de escritura /insert")
        res.status(401).json({ msg: "El usuario no tiene los permisos correctos"}) 
    }
            

})

module.exports = router;