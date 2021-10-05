const   log = require("../log"),
        solar = require("solardb-core"),
        jwt = require('jwt-simple'),
        path = require('path'), 
        { validate: uuidValidate } = require('uuid');

exports.indexDecode = (data) => {
    try {
        return decoded = jwt.decode(data, config.hindex);
    } catch(err) {
        log.reg(deployPath, "Existe un error al desencriptar Index" + err)
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
            const preresponse = this.indexDecode(datainStore)
            const tokhead = head.split("Bearer ")[1]

                if((datainStore[0].code != "ENOENT" || 
                    preresponse != 0) &&
                    preresponse.key == tokhead){

                    if(uuidValidate(jwt.decode(preresponse.token+"."+tokhead, config.htoken))){

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
            res.status(401).json({ msg: "Token es erroneo"})
        }

    } else {

        log.reg(deployPath, "El token no esta Presente ")
        res.status(401).json({ msg: "El token no esta Presente"})

    }
    
};

// return an array of objects according to key, value, or key and value matching
exports.getObjects = (obj, key, val) => {
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

// return an array of values that match on a certain key
exports.getValues = (obj, key) => {
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

// return an array of keys that match on a certain value
exports.getKeys = (obj, val) => {
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