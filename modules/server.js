require('dotenv').config();
const solar = require("solardb-core")
const express = require("express")
const helmet = require("helmet");
const jwt = require('jwt-simple');
const generator = require('generate-password');
const { validate: uuidValidate } = require('uuid');
const c = require("loggering")
const Ajv = require("ajv")

const nuser = (fiStack) =>{

    const { v4: uuidv4 } = require('uuid');

    const user = generator.generate({
        length: 5,
        numbers: true
    });
    const password = generator.generate({
        length: 12,
        numbers: true
    });

    const tokn = jwt.encode(uuidv4(), fiStack.hashToken)

    const data = jwt.encode({
        username: user,
        password: password,
        token: tokn.split('.')[0]+"."+tokn.split('.')[1],
        key: tokn.split('.')[2],
        admin: true,
        permits: {
            "create": true,
            "read": true,
            "update": true,
            "delete": true
        }
    }, fiStack.hashIndex);

    let r = solar.dbInsert(data, "Users", fiStack.container)

    console.log("User", {
        username: user,
        password: password,
        token: tokn.split('.')[2]
    })

}

const run = (fiStack, deployPath) =>{

    const tokenDecode = (head) =>{
        try {
            const indexes = solar.dbGetIndex("Users", fiStack.container)
            let response
            indexes.map(id => {

                const datainStore = solar.dbGetData(id, "Users", fiStack.container).pop()
                const preresponse = indexDecode(datainStore)
                const tokhead = head.split("Bearer ")[1]

                    if((datainStore[0].code != "ENOENT" || 
                    preresponse != 0) &&
                    preresponse.key == tokhead){

                        if(uuidValidate(
                        jwt.decode(preresponse.token+"."+tokhead, fiStack.hashToken))){
                            response = { id: id, permits: preresponse.permits}
                        } 

                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({ type: "error", msg : "Token no valido", token: head })+",", false)
                        response = 0
                    }

            })
            return response
        } catch(err) { 
            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : err})+",", false)
            return 0 
        }
    }

    const indexDecode = (data) =>{
        try {
            return decoded = jwt.decode(data, fiStack.hashIndex);
        } catch(err) {
            return 0
        }
    }

    const jsonErrorHandler = async (err, req, res, next) => {
        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Los datos enviados no son JSON", data: { error: err, headers: req.headers } })+",", false)
        res.send({ status: 100, msg : "Los datos enviados no son JSON" });
    }

    const userVerify =  (collection) => {

        if(collection == "Users"){
            return 0
        } else {
            return 1
        }
    }

    // Express Server Init

        const port = fiStack.port
        const exsrv = express()
        
        exsrv.use(express.json())
        exsrv.use(helmet())
        exsrv.use(jsonErrorHandler)

        // Activity

        exsrv.get('/', (req, res) => {

            if (!req.headers.authorization) {
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token no valido en /", token: req.headers.authorization })+",", false)
                res.send({ message: "Tu petición no tiene cabecera de autorización" });
            } else {
                const user = tokenDecode(req.headers.authorization)
                if(user != 0){
                    res.json({ status: 205, msg: "Response OK", user: tokenDecode(req.headers.authorization) })
                } else {
                    res.send({ status: 201, msg: "Token es erroneo"})
                }
            }
            
        })

        exsrv.post('/insert', (req, res) => {

            const ajv = new Ajv()
            const schema = {
                type: "object",
                properties: {
                    collection: { type: "string" },
                    data: { type: "object" }
                },
                required: ["collection", "data"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            
            if(req.headers.authorization && validate(req.body) == true && userVerify(req.body.collection) != 0 ){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.create === true){
                            if(req.body.collection != undefined && req.body.collection != "" && req.body.data != undefined && req.body.data != "" ){
                                try{
                                    const insert = solar.dbInsert(
                                        jwt.encode(req.body.data, fiStack.hashIndex),
                                        req.body.collection,
                                        fiStack.container)
                                    if(insert.id){
                                        res.send({
                                            status: 205,
                                            msg: "Response OK",
                                            id: insert.id
                                        })
                                    } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /insert", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /insert" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /insert" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /insert", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /insert", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /insert", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })

        exsrv.put('/updates', (req, res) => {

            const ajv = new Ajv()
            const schema = {
                type: "object",
                properties: {
                    collection: { type: "string" },
                    id: { type: "string" },
                    data: { type: "object" }
                },
                required: ["collection", "id", "data"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            
            if(req.headers.authorization && validate(req.body) == true  && userVerify(req.body.collection) != 0 ){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.update === true){
                            if(req.body.collection != undefined && req.body.collection != "" && 
                                req.body.data != undefined && req.body.data != "" && 
                                req.body.id != undefined && req.body.id != ""){
                                try{
                                    const data = jwt.encode(req.body.data, fiStack.hashIndex);
                                    const datainStore = solar.dbGetData( req.body.id, req.body.collection, fiStack.container).pop()
                                    if(datainStore == data){ res.send({ status: 161, msg: "Los datos guardados son iguales a los que propone"}) } 
                                    else {
                                        const r = solar.dbUpdate(data, req.body.id, req.body.collection, fiStack.container)
                                        if(r.id){
                                            res.send({
                                                status: 205,
                                                msg: "Response OK",
                                                id: r.id
                                            })
                                        } else { 
                                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /select", err: err })+",", false)
                                            res.send({ status: 204, msg: "No se encontraron Datos"})
                                        }
                                    }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /select", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /select" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /select" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /select", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })

        exsrv.get('/select', (req, res) => {

            const ajv = new Ajv()
            const schema = {
                type: "object",
                properties: {
                    collection: { type: "string" },
                    id: { type: "string" },
                    type: { type: "string" }
                },
                required: ["collection", "id", "type"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            
            if(req.headers.authorization && validate(req.body) == true){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.read === true){
                            if(req.body.collection != undefined && req.body.collection != "" && 
                            req.body.type != undefined && req.body.type != "" && 
                            req.body.id != undefined && req.body.id != ""){
                                try{
                                    let datainStore
                                    let response
                                    if (req.body.type === "latest"){
                
                                        datainStore = solar.dbGetData(req.body.id, req.body.collection, fiStack.container).pop()
                                        response = indexDecode(datainStore)
                
                                    } else if (req.body.type === "all"){
                
                                        let jsonData = {}; 
                                        let index = 0
                
                                        datainStore = solar.dbGetData(req.body.id, req.body.collection, fiStack.container)
                
                                        if(datainStore[0].code != "ENOENT"){
                                            datainStore.map(itm => {
                                                jsonData[index] = indexDecode(itm)
                                                index ++
                                            })
                                            response = jsonData
                                        } else { response = 0 }
                                        
                                    }
                                    if(response != 0){
                                        res.send({
                                            status: 205,
                                            msg: "Response OK",
                                            data: response
                                        })
                                    } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /select", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /select" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /select" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /select", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })

        exsrv.get('/select/search/specific', (req, res) => {
            const ajv = new Ajv()
            const schema = {
                type: "object",
                properties: {
                    collection: { type: "string" },
                    tag: { type: "string" },
                    type: { type: "string" }
                },
                required: ["collection", "tag", "type"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            
            if(req.headers.authorization && validate(req.body) == true){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.create === true){
                            if(req.body.collection != undefined && req.body.collection != "" && 
                            req.body.type != undefined && req.body.type != ""){
                                try{
            
                                    let datainStore
                                    let response
                                    let jsonData = {}; 
                                    let index = 0
                
                                    let indexes = solar.dbGetIndex(req.body.collection, fiStack.container)
                
                                    if (req.body.type === "latest"){
                
                                        indexes.map(id => {
                                            datainStore = solar.dbGetData(id, req.body.collection, fiStack.container).pop()
                                            let ref = 0
                                            let predata = {}
                                                    preresponse = indexDecode(datainStore)
                                                    if(datainStore[0].code != "ENOENT" || preresponse != 0){
                                                        predata[ref] = { "data" : preresponse[req.body.tag] }
                                                        ref ++
                                                    } else { response = 0 }
                                            jsonData[index] = { "index": id, "history" : predata }
                                            index ++
                                        })
                                        response = jsonData
                
                                    } else if (req.body.type === "all"){
                
                                        indexes.map(id => {
                                            datainStore = solar.dbGetData(id, req.body.collection, fiStack.container)
                                            let ref = 0
                                            let predata = {}
                                                datainStore.map(item =>{
                                                    preresponse = indexDecode(item)
                                                    if(datainStore[0].code != "ENOENT" || preresponse != 0){
                                                        predata[ref] = { "data" : preresponse[req.body.tag] }
                                                        ref ++
                                                    } else { response = 0 }
                                                })
                                            jsonData[index] = { "index": id, "history" : predata }
                                            index ++
                                        })
                                        response = jsonData
                
                                    }
                
                                    if(response != 0){
                                        res.send({
                                            status: 205,
                                            msg: "Response OK",
                                            tag: req.body.tag,
                                            data: response
                                        })
                                    } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /select/search/specific", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /select/search/specific" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /select/search/specific" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select/search/specific", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /select/search/specific", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select/search/specific", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })

        exsrv.get('/select/query/keys', (req, res) => {
            const ajv = new Ajv()
            const schema = {
                type: "object",
                properties: {
                    collection: { type: "string" },
                    keys: { type: "array" },
                    type: { type: "string" }
                },
                required: ["collection", "keys", "type"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            
            if(req.headers.authorization && validate(req.body) == true){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.read === true){
                            if(req.body.collection != undefined && req.body.collection != "" && 
                                req.body.type != undefined && req.body.type != ""){
                                try{
                                    const returns = (data, cant) =>{
                                        if(data != 0){
                                            res.send({
                                                status: 205,
                                                msg: "Response OK",
                                                total: cant,
                                                data: data
                                            })
                                        } else { res.send({ status: 95, msg: "No se encontraron datos"}) }
                                    }
                                    if (req.body.type === "latest"){
                                        let datainStore = solar.dbGetIndex(req.body.collection, fiStack.container)
                                            let map1 = 0
                                            let preresponse = []
                                            datainStore.map( id => {
                                                let prepreresponse = []
                                                let map2 = 0
                                                let data = indexDecode(solar.dbGetData(id, req.body.collection, fiStack.container).pop())
                                                    req.body.keys.map(key => {
                                                        if(data[key]){
                                                            prepreresponse[map2] = data[key]
                                                            map2++
                                                            preresponse[map1] = { index: id, data: prepreresponse }
                                                            map1 ++
                                                        } 
                                                    })
                                                    
                                            })
                                            returns (preresponse, map1)
                                    } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /select/query/keys", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /select/query/keys" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /select/query/keys" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select/query/keys", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /select/query/keys", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select/query/keys", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })

        exsrv.get('/select/query/where', (req, res) => {
            const ajv = new Ajv()
            const schema = {
                type: "object",
                properties: {
                    collection: { type: "string" },
                    where: { type: "array" },
                    type: { type: "string" }
                },
                required: ["collection", "where", "type"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            
            if(req.headers.authorization && validate(req.body) == true){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.read === true){
                            if(req.body.collection != undefined && req.body.collection != "" && 
                                req.body.type != undefined && req.body.type != ""){
                                try{
                                    const returns = (data, cant) =>{
                                        if(data != 0){
                                            res.send({
                                                status: 205,
                                                msg: "Response OK",
                                                total: cant,
                                                data: data
                                            })
                                        } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                    }
                                    if (req.body.type === "latest"){
                                        let datainStore = solar.dbGetIndex(req.body.collection, fiStack.container)
                                            let map1 = 0
                                            let prepreresponse = []
                                            datainStore.map( id => {
                                                let data = indexDecode(solar.dbGetData(id, req.body.collection, fiStack.container).pop())
                                                let data2 = data[req.body.where[0]]
                                                let arg = req.body.where[1]
                                                let ref = req.body.where[2]
                                                switch (arg) {
                                                    case "==":
                                                        if(data2 == ref){
                                                            let dataOk = data[req.body.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                    case "===":
                                                        if(data2 === ref){
                                                            let dataOk = data[req.body.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                        break;
                                                        case ">=":
                                                            if(data2 >= ref){
                                                                let dataOk = data[req.body.where[0]]
                                                                prepreresponse[map1] = {index: id, data: dataOk }
                                                                map1++
                                                            }
                                                            break;      
                                                        case ">":
                                                            if(data2 > ref){
                                                                let dataOk = data[req.body.where[0]]
                                                                prepreresponse[map1] = {index: id, data: dataOk }
                                                                map1++
                                                            }
                                                            break;
                                                        case "<=":
                                                            if(data2 <= ref){
                                                                let dataOk = data[req.body.where[0]]
                                                                prepreresponse[map1] = {index: id, data: dataOk }
                                                                map1++
                                                            }
                                                            break;      
                                                        case "<":
                                                            if(data2 < ref){
                                                                let dataOk = data[req.body.where[0]]
                                                                prepreresponse[map1] = {index: id, data: dataOk }
                                                                map1++
                                                            }
                                                            break;         
                                                        case "!=":
                                                            if(data2 != ref){
                                                                let dataOk = data[req.body.where[0]]
                                                                prepreresponse[map1] = {index: id, data: dataOk }
                                                                map1++
                                                            }
                                                            break;                                                   
                                                    default:
                                                        break;
                                                }
                                            })
                                            returns (prepreresponse, map1)
                                    } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /select/query/where", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /select/query/where" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /select/query/where" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select/query/where", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /select/query/where", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /select/query/where", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })

        exsrv.delete('/delete/:collection/:id', (req, res) => {
            if(req.headers.authorization  && userVerify(req.body.collection) != 0){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.delete === true){
                            if(req.params.collection != undefined && req.params.id != undefined){
                                try{
                                    const datainStore = solar.dbDeleteData(req.params.id, req.params.collection, fiStack.container)
                                    if(datainStore === 1){
                                        res.send({
                                            status: 205,
                                            msg: "Response OK"
                                        })
                                    } else { res.send({ status: 204, msg: "No se encontraron datos"}) }
                                }catch(err){
                                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /delete", err: err })+",", false)
                                    res.send({ status: 204, msg: "No se encontraron Datos"})
                                }
                            } else { 
                                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /delete" })+",", false)
                                res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
                            }
                        } else { 
                            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /delete" })+",", false)
                            res.send({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
                        }
                    } else { 
                        c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /delete", token: req.headers.authorization })+",", false)
                        res.send({ status: 201, msg: "Token es erroneo"}) 
                    }
                } catch(err) {
                    c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Error Interno en /delete", err: err })+",", false)
                    res.send({ status: 200, msg: "Existe un error interno", err: err})
                }
            } else { 
                c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Token es erroneo /delete", token: req.headers.authorization })+",", false)
                res.send({ status: 199, msg: "Token es erroneo o el JSON enviado no es correcto"}) 
            }
        })     
    
        
    // Server Init

    exsrv.listen(port, () => {
        console.log('El servidor fue inicializado')
    }).on('error', function (err) {
        if(err.errno === -4091) {
            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", err : err, msg : `El puerto ${port} esta ocupado, que tal si usa ${parseInt(port) + 1}`})+",", false)
            console.log(`----- El puerto ${port} esta ocupado, que tal si usa ${parseInt(port) + 1} -----`);
        } else {
            c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", err : err})+",", false)
        }
    });

}

exports.run = run;
exports.nuser = nuser;