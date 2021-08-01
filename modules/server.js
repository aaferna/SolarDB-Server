const solar = require("solardb-core")
const express = require("express")
const helmet = require("helmet");
const jwt = require('jwt-simple');
const generator = require('generate-password');
const { validate: uuidValidate } = require('uuid');

const init = (fiStack) =>{

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

const run = (fiStack) =>{

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

                    } else { response = 0 }

            })
            return response
        } catch(err) { return 0 }
    }

    const indexDecode = (data) =>{
        try {
            return decoded = jwt.decode(data, fiStack.hashIndex);
        } catch(err) {
            return 0
        }
    }

    // Express Server Init
        const port = fiStack.port
        const exsrv = express()
        exsrv.use(express.json());
        exsrv.use(express.urlencoded({ extended: true }));
        exsrv.use(helmet());

    // Activity

        exsrv.get('/', (req, res) => {

            if (!req.headers.authorization) {
                return res
                .status(403)
                .send({ message: "Tu petición no tiene cabecera de autorización" });
            } else {
                res.json({ service: 'Ok', user: tokenDecode(req.headers.authorization) })
            }
            
        })

        exsrv.post('/insert', (req, res) => {
            if(req.headers.authorization){
                try {
                    const userVerify = tokenDecode(req.headers.authorization)
                    if(userVerify != 0){
                        if(userVerify.permits.create === true){
                            if(req.body.collection != undefined && req.body.collection != "" && req.body.data != undefined){
                                try{
                                    const insert = solar.dbInsert(
                                        jwt.encode(req.body.data, fiStack.hashIndex),
                                        req.body.collection,
                                        fiStack.container)
                                    if(insert.id){
                                        res.send({
                                            status: 150,
                                            msg: "Index Creado",
                                            id: insert.id
                                        })
                                    } else { res.send({ status: 75, msg: "No se creo el index"}) }
                                }catch(err){
                                    // console.log(err)
                                    res.send({ status: 204, msg: "No se creo el index"})
                                }
                            } else { res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) }
                        } else { res.send({ status: 202, msg: "El usuario no tiene permisos de escritura"}) }
                    } else { res.send({ status: 201, msg: "Token es erroneo"}) }
                } catch(err) {
                    // console.log(err)
                    res.send(res.send({ status: 200, msg: "Existe un error interno", err: err}))
                }
            }
        })

        exsrv.put('/update', (req, res) => {
            if(req.headers.authorization){
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
                                                status: 160,
                                                msg: "Los datos fueron guardados",
                                                id: r.id
                                            })
                                        } else { res.send({ status: 80, msg: "No se actualizo el index"}) }
                                    }
                                }catch(err){
                                     console.log(err)
                                    res.send({ status: 204, msg: "Existe un inconveniente con la consulta", err: err})
                                }
                            } else { res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) }
                        } else { res.send({ status: 202, msg: "El usuario no tiene permisos de escritura"}) }
                    } else { res.send({ status: 201, msg: "Token es erroneo"}) }
                } catch(err) {
                    // console.log(err)
                    res.send(res.send({ status: 200, msg: "Existe un error interno", err: err}))
                }
            }
        })

        exsrv.get('/select', (req, res) => {
            if(req.headers.authorization){
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
                                            status: 170,
                                            data: response
                                        })
                                    } else { res.send({ status: 85, msg: "No se encontro el index"}) }
                                }catch(err){
                                    console.log(err)
                                    res.send({ status: 204, msg: "No se actualizo el index"})
                                }
                            } else { res.send({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) }
                        } else { res.send({ status: 202, msg: "El usuario no tiene permisos de escritura"}) }
                    } else { res.send({ status: 201, msg: "Token es erroneo"}) }
                } catch(err) {
                    // console.log(err)
                    res.send(res.send({ status: 200, msg: "Existe un error interno", err: err}))
                }
            }
        })

        exsrv.get('/select/search/specific', (req, res) => {
            if(req.headers.authorization){
                try {
                    const token = tokenDecode(req.headers.authorization)
                    if(token != 0){
                        const index = solar.dbGetData( token, "Users", fiStack.container ).pop()
                        const r = indexDecode( index )
                        const json = req.body
                        if(r != 0 && json.collection != undefined && json.tag != undefined  && json.type != undefined){

                            try{

                                let datainStore
                                let response
                                let jsonData = {}; 
                                let index = 0

                                let indexes = solar.dbGetIndex(json.collection, fiStack.container)

                                if (json.type === "latest" || json.type === ""){

                                    indexes.map(id => {
                                        datainStore = solar.dbGetData(id, json.collection, fiStack.container).pop()
                                        let ref = 0
                                        let predata = {}
                                                preresponse = indexDecode(datainStore)
                                                if(datainStore[0].code != "ENOENT" || preresponse != 0){
                                                    predata[ref] = { "data" : preresponse[json.tag] }
                                                    ref ++
                                                } else { response = 0 }
                                        jsonData[index] = { "index": id, "history" : predata }
                                        index ++
                                    })
                                    response = jsonData

                                } else if (json.type === "all"){

                                    indexes.map(id => {
                                        datainStore = solar.dbGetData(id, json.collection, fiStack.container)
                                        let ref = 0
                                        let predata = {}
                                            datainStore.map(item =>{
                                                preresponse = indexDecode(item)
                                                if(datainStore[0].code != "ENOENT" || preresponse != 0){
                                                    predata[ref] = { "data" : preresponse[json.tag] }
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
                                        status: 120,
                                        tag: json.tag,
                                        data: response
                                    })
                                } else { res.send({ status: 200, msg: "No se encontro el index"}) }

                            }catch(err){
                                console.log(err)
                                res.send({ status: 200, msg: "No se actualizo el index"})
                            }

                        } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo o consulta mal armada"}) }
                    } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo"}) }
                } catch(err) {
                    console.log(err)
                    res.send("Hubo un error en la consulta")
                }
            }
        })

        exsrv.get('/select/query', (req, res) => {
            if(req.headers.authorization){
                try {
                    const token = tokenDecode(req.headers.authorization)
                    if(token != 0){
                        const index = solar.dbGetData( token, "Users", fiStack.container ).pop()
                        const r = indexDecode( index )
                        const json = req.body
                        if(r != 0 && json.collection != undefined && json.query != undefined && json.type != undefined){
                            try{

                                const returns = (data, cant) =>{
                                    if(data != 0){
                                        res.send({
                                            status: 120,
                                            total: cant,
                                            data: data
                                        })
                                    } else { res.send({ status: 200, msg: "No se encontro el index"}) }
                                }

                                if (json.type === "latest" || json.type === ""){

                                    let datainStore = solar.dbGetIndex(json.collection, fiStack.container)

                                    if(json.query.keys){
                                        let map1 = 0

                                        datainStore.map( id => {

                                            let prepreresponse = []
                                            let map2 = 0
                                            let data = indexDecode(solar.dbGetData(id, json.collection, fiStack.container).pop())

                                                json.query.keys.map(key => {
                                                    if(data[key]){
                                                        prepreresponse[map2] = data[key]
                                                        map2++
                                                    } 
                                                })

                                            preresponse[map1] = { index: id, data: prepreresponse }
                                            map1 ++

                                        })

                                        returns (preresponse, map1)
                                    }

                                    if(json.query.where){
                                        let map1 = 0
                                        let prepreresponse = []

                                        datainStore.map( id => {

                                            let data = indexDecode(solar.dbGetData(id, json.collection, fiStack.container).pop())

                                            let data2 = data[json.query.where[0]]
                                            let arg = json.query.where[1]
                                            let ref = json.query.where[2]
    
                                            switch (arg) {
                                                case "==":
                                                    if(data2 == ref){
                                                        let dataOk = data[json.query.where[0]]
                                                        prepreresponse[map1] = {index: id, data: dataOk }
                                                        map1++
                                                    }
                                                case "===":
                                                    if(data2 === ref){
                                                        let dataOk = data[json.query.where[0]]
                                                        prepreresponse[map1] = {index: id, data: dataOk }
                                                        map1++
                                                    }
                                                    break;
                                                    case ">=":
                                                        if(data2 >= ref){
                                                            let dataOk = data[json.query.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                        break;      
                                                    case ">":
                                                        if(data2 > ref){
                                                            let dataOk = data[json.query.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                        break;
                                                    case "<=":
                                                        if(data2 <= ref){
                                                            let dataOk = data[json.query.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                        break;      
                                                    case "<":
                                                        if(data2 < ref){
                                                            let dataOk = data[json.query.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                        break;         
                                                    case "!=":
                                                        if(data2 != ref){
                                                            let dataOk = data[json.query.where[0]]
                                                            prepreresponse[map1] = {index: id, data: dataOk }
                                                            map1++
                                                        }
                                                        break;                                                   
                                                default:
                                                    break;
                                            }


                                        })

                                        returns (prepreresponse, map1)


                                    }

                                } else { res.send({ status: 200, msg: "No se encontro index"}) }

                            }catch(err){
                                console.log(err)
                                res.send({ status: 200, msg: "No se encontro index"})
                            }
                        } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo o consulta mal armada"}) }
                    } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo"}) }
                } catch(err) {
                    console.log(err)
                    res.send("Hubo un error en la consulta")
                }
            }
        })

        exsrv.delete('/delete', (req, res) => {
            if(req.headers.authorization){
                try {
                    const token = tokenDecode(req.headers.authorization)
                    if(token != 0){
                        const index = solar.dbGetData( token, "Users", fiStack.container ).pop()
                        const r = indexDecode( index )
                        const json = req.body
                        if(r != 0 && json.collection != undefined && json.id != undefined ){
                            try{
                                const datainStore = solar.dbDeleteData(json.id, json.collection, fiStack.container)
                                    if(datainStore){
                                        res.send({
                                            status: 120,
                                            msg: "Index Eliminado"
                                        })
                                    } else { res.send({ status: 200, msg: "No se encontro el index"}) }
                            }catch(err){
                                console.log(err)
                                res.send({ status: 200, msg: "No se actualizo el index"})
                            }
                        } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo o consulta mal armada"}) }
                    } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo"}) }
                } catch(err) {
                    console.log(err)
                    res.send("Hubo un error en la consulta")
                }
            }
        })     
           
    // Server Init

        exsrv.listen(port, () => {
            console.log(`Escuchando http://localhost:${port}`)
        })

}

exports.run = run;
exports.init = init;