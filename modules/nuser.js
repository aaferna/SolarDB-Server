const solar = require("solardb-core")
const jwt = require('jwt-simple');
const generator = require('generate-password');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


exports.create = () => {
    
    const config = require("../config.json");
    let container = path.join(deployPath, "/system/")

    solar.dbCreateCollection ("users", container)

    const user = generator.generate({
        length: 5,
        numbers: true
    });

    const password = generator.generate({
        length: 12,
        numbers: true
    });

    const tokn = jwt.encode(uuidv4(), config.htoken)

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
    }, config.hindex);

    solar.dbInsert(data, "users", container)
    
    console.log("User", {
        username: user,
        password: password,
        token: tokn.split('.')[2]
    })

}