const log = require("../log");
const solar = require("solardb-core")
const jwt = require('jwt-simple');
const path = require('path');
const { validate: uuidValidate } = require('uuid');

exports.indexDecode = (data) =>{
    try {
        return decoded = jwt.decode(data, config.hindex);
    } catch(err) {
        return 0
    }
}
exports.tokenDecode = (head) =>{

    try {
        
        let response

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