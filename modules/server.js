const solar = require("solardb-core")
const express = require("express")
const cors = require('cors');
const path = require('path');
const jwt = require('jwt-simple');
const generator = require('generate-password');

const init = (fiStack) =>{

    const user = generator.generate({
        length: 5,
        numbers: true
    });
    const password = generator.generate({
        length: 12,
        numbers: true
    });

    const data = jwt.encode({
        username: user,
        password: password,
        level: 1
    }, fiStack.hashIndex);

    let r = solar.dbInsert(data, "Users", fiStack.container)

    console.log("User", {
        username: user,
        password: password,
        token: jwt.encode(r.id, fiStack.hashToken)
    })

}

const run = (fiCors, fiStack) =>{

    const tokenDecode = (tokhead) =>{
        try {
            const token = tokhead.split("Bearer ")[1]
            return decoded = jwt.decode(token, fiStack.hashToken);
        } catch(err) {
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

    // Express Server Init
        const port = fiStack.port
        const exsrv = express()
        exsrv.use(cors(fiCors));
        // exsrv.use(bodyParser.urlencoded({
        //     extended: true
        // }));
        exsrv.use(express.json());

    // Activity

        exsrv.get('/', (req, res) => {

            if (!req.headers.authorization) {
                return res
                .status(403)
                .send({ message: "Tu petición no tiene cabecera de autorización" });
            } else {
                res.json({ service: 'Ok' })
            }
            
        })

        exsrv.post('/insert', (req, res) => {
            if(req.headers.authorization){
                try {
                    const token = tokenDecode(req.headers.authorization)
                    if(token != 0){
                        const index = solar.dbGetData( token, "Users", fiStack.container ).pop()
                        const r = indexDecode( index )
                        const json = req.body
                        if(r != 0 && json.collection != undefined ){
                            try{
                                const data = jwt.encode(json.data, fiStack.hashIndex);
                                const r = solar.dbInsert(data, json.collection, fiStack.container)
                                if(r.id){
                                    res.send({
                                        status: 100,
                                        msg: "Index Creado",
                                        id: r.id
                                    })
                                } else { res.send({ status: 200, msg: "No se creo el index"}) }
                            }catch(err){
                                console.log(err)
                                res.send({ status: 200, msg: "No se creo el index"})
                            }
                        } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo o consulta mal armada"}) }
                    } else { res.send({ status: 200, msg: "Fallo la consulta: Token erroneo"}) }
                } catch(err) {
                    console.log(err)
                    res.send("Hubo un error en la consulta")
                }
            }
        })

        exsrv.put('/update', (req, res) => {
            if(req.headers.authorization){
                try {
                    const token = tokenDecode(req.headers.authorization)
                    if(token != 0){
                        const index = solar.dbGetData( token, "Users", fiStack.container ).pop()
                        const r = indexDecode( index )
                        const json = req.body
                        if(r != 0 && json.collection != undefined ){

                            try{
                                const data = jwt.encode(json.data, fiStack.hashIndex);
                                const datainStore = solar.dbGetData( json.id, json.collection, fiStack.container).pop()

                                if(datainStore == data){
                                    res.send({ status: 110, msg: "Index Actualizado"})
                                }else{
                                    const r = solar.dbUpdate(data, json.id, json.collection, fiStack.container)
                                    if(r.id){
                                        res.send({
                                            status: 110,
                                            msg: "Index Actualizado",
                                            id: r.id
                                        })
                                    } else { res.send({ status: 200, msg: "No se actualizo el index"}) }
                                }

                                
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