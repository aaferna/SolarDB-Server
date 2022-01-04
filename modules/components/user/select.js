const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        jwt = require('jwt-simple'),
        solar = require("solardb-core"),
        path = require('path');
        
        router.get('/user/list', tokenValidator, (req, res) => {

            if(req.user.admin === true){
                try{
                    const container = path.join(deployPath, "/system/")
                    let datainStore = solar.dbGetIndex("users", container)
                    let response = []

                    datainStore.map( id => {

                        let data = jwt.decode(
                                solar.dbGetData(id, "users", container).pop(),
                                config.utoken
                            );

                        response.push( {
                            id: id,
                            username: data.username,
                            admin: data.admin ? true : false,
                            permits: typeof data.permits === 'object' ? data.permits : data.databases 
                        })
                    })

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