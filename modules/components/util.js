const   log = require("../log"),
        solar = require("solardb-core"),
        jwt = require('jwt-simple'),
        path = require('path'), 
        { validate: uuidValidate } = require('uuid'),
        BSON = require('bson');

exports.indexDecode = (data) => {
    try {

        if(config.encrypt === "jwt"){
            return jwt.decode(data, config.hindex);
        } else if(config.encrypt === "bson"){
            return BSON.deserialize(Buffer.from(data));
        } else {
            log.reg(deployPath, "No esta configurado un Encrypt")
            return 0
        }

    } catch(err) {
        log.reg(deployPath, "Existe un error al desencriptar Index" + err)
        return 0
    }
}

exports.indexEncode = (data) => {
    try {

        if(config.encrypt === "jwt"){
            return jwt.encode(data, config.hindex);
        } else if(config.encrypt === "bson"){
            return BSON.serialize(data);
        } else {
            log.reg(deployPath, "No esta configurado un Encrypt")
            return 0
        }

    } catch(err) {
        log.reg(deployPath, "Existe un error al encriptar Index" + err)
        return 0
    }
}

exports.tokenDecode = (head) => {


    try {
        
        let response = 0

        const container = path.join(deployPath, "/system/")
        const indexes = solar.dbGetIndex("users", container)

        indexes.map(id => {

            const datainStore = solar.dbGetData(id, "users", container).pop()
            const preresponse = jwt.decode(datainStore, config.utoken);
            const tokhead = head.split("Bearer ")[1]

                if((datainStore[0].code != "ENOENT" || 
                    preresponse != 0) &&
                    preresponse.key == tokhead){

                        let prese = jwt.decode(preresponse.token+"."+tokhead, config.htoken)
                        let ires = uuidValidate(prese)

                    if(ires){
                        response = { 
                            id: id, 
                            admin: preresponse.admin ? true : false, 
                            permits: preresponse.permits ? preresponse.permits : preresponse.databases 
                        }
                    } 

                }
        })
        
        return response

    } catch(err) { 

        log.reg(deployPath, "Existe un error en el Validor de TOKENs" + err)
        return 0

    }

}

exports.removeItemAll = (arr, value) => {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) { arr.splice(i, 1);
        } else { ++i;  }
    }
    return arr;
}

exports.searchPermits = (user, db, permits) => {

    for (const datb in user) {
        if(datb === db){
            return user[datb][permits] ? true : false
        }
    }

}

global.tokenValidator = (req, res, next) => {

    if(req.headers.authorization){

        const user = this.tokenDecode(req.headers.authorization)

        if(user != 0 && user != undefined){
            req.user = user;
            next();
        } else {
            log.reg(deployPath, "Token erroneo al acceder" + JSON.stringify(req.headers.authorization))
            res.json({ msg: "Token es erroneo"})
        }

    } else {

        log.reg(deployPath, "El token no esta Presente ")
        res.json({ msg: "El token no esta Presente"})

    }
    
};
