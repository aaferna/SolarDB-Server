const   express = require('express'), 
        router = express.Router(), 
        log = require("../log"), 
        util = require("./util");

router.post('/insert/:store/:collection', tokenValidator, (req, res) => {

    if(!req.params.store || !req.params.collection){
        res.status(400).json({ msg: "Valide tener ingresado Store y Collection" })
    } 
    
    if(searchPermits(userVerify.permits, req.body.collection, "create") === true || userVerify.admin === true){
        if(req.body.collection != undefined && req.body.collection != "" && req.body.data != undefined && req.body.data != "" ){
            try{
                const insert = solar.dbInsert(
                    jwt.encode(req.body.data, fiStack.hashIndex),
                    req.body.collection,
                    fiStack.container)
                if(insert.id){
                    res.json({
                        status: 205,
                        msg: "Response OK",
                        id: insert.id
                    })
                } else { res.json({ status: 204, msg: "No se encontraron datos"}) }
            }catch(err){
                // c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "No se encontraron datos /insert", err: err })+",", false)
                res.json({ status: 204, msg: "No se encontraron Datos"})
            }
        } else { 
            // c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "Fallo la consulta: consulta mal armada /insert" })+",", false)
            res.json({ status: 203, msg: "Fallo la consulta: consulta mal armada"}) 
        }
    } else { 
        // c.loggering(process.env.LOG,'SolarDB', JSON.stringify({type: "error", msg : "El usuario no tiene permisos de escritura /insert" })+",", false)
        res.json({ status: 202, msg: "El usuario no tiene los permisos correctos"}) 
    }
            

})

module.exports = router;