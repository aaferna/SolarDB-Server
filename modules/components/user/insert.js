
const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        jwt = require('jwt-simple'), 
        { v4: uuidv4 } = require('uuid'), 
        path = require('path'),
        solar = require("solardb-core"),
        isJSON = require('is-valid-json');

        router.post('/user', tokenValidator, (req, res) => {
                if(req.user.admin === true){
                    if(isJSON(req.body) && Object.keys(req.body).length !== 0){

                        try{

                            const   container = path.join(deployPath, "/system/"),
                                    user = req.body.username, 
                                    password = req.body.password, 
                                    tokn = jwt.encode(uuidv4(), config.htoken),
                                    data = {
                                        username: user,
                                        password: password,
                                        token: tokn.split('.')[0]+"."+tokn.split('.')[1],
                                        key: tokn.split('.')[2],
                                        admin: false,
                                        permits: req.body.databases
                                    }
                        
                            const insert = solar.dbInsert(jwt.encode(data, config.utoken), "users", container)

                            if(insert.id){
                                res.json({ id: insert.id, token: data.key })
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
        })

module.exports = router;