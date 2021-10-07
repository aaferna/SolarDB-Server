const   express = require('express'), 
        router = express.Router(), 
        log = require("../../log"), 
        util = require("../util"),
        solar = require("solardb-core"),
        isJSON = require('is-valid-json');

        const getObjects = (obj, key, val) => {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getObjects(obj[i], key, val));    
                } else 
                //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
                if (i == key && obj[i] == val || i == key && val == '') { //
                    objects.push(obj);
                } else if (obj[i] == val && key == ''){
                    //only add if the object is not already in the array
                    if (objects.lastIndexOf(obj) == -1){
                        objects.push(obj);
                    }
                }
            }
            return objects;
        }
        
        const getValues = (obj, key) => {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getValues(obj[i], key));
                } else if (i == key) {
                    objects.push(obj[i]);
                }
            }
            return objects;
        }
        
        const getKeys = (obj, val) => {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getKeys(obj[i], val));
                } else if (obj[i] == val) {
                    objects.push(i);
                }
            }
            return objects;
        }
        router.get('/search/keyvalue/:pop?', tokenValidator, (req, res) => {

            if(!req.body.collection && !req.body.id){
                res.status(400).json({ msg: "Valide tener ingresado la Coleccion" })
            } else {
            
                if(util.searchPermits(req.user.permits, req.body.collection, "select") === true || req.user.admin === true){
                    if(isJSON(req.body) && Object.keys(req.body).length !== 0){
                        try{

                            let histoDecode = [], search, history = solar.dbGetData(
                                req.body.id, 
                                req.body.collection,
                                config.container
                            ), elements

                            if(req.params.pop){

                                elements = history.pop()

                                decode = util.indexDecode(elements)
                                detect = getObjects(decode, req.body.key, req.body.value)
                                histoDecode.push(
                                    {
                                        position: "pop", 
                                        search: search, 
                                        response: detect
                                    }
                                )

                            } else {

                                elements = history
                                search = new Object();
                                search[req.body.key] = req.body.value
                                
                                for (let index = 0; index < elements.length; index++) {
                                    
                                    let detect, decode
                                    decode = util.indexDecode(elements[index])
                                    detect = getObjects(decode, req.body.key, req.body.value)
                                    
                                    if(isJSON(detect[0])){
                                        histoDecode.push(
                                            {
                                                position: index, 
                                                search: search, 
                                                response: detect
                                            }
                                        )
                                    }
                                    
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
                        res.status(400).json({ msg: "El JSON enviado no es Valido"}) 
                    }
                } else { 
                    log.reg(deployPath, "El usuario no tiene permisos de lectura /select")
                    res.status(401).json({ msg: "El usuario no tiene los permisos correctos"}) 
                }
            }     

        })

module.exports = router;