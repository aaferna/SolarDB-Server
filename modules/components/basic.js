const   express = require('express'), 
        router = express.Router(),
        util = require("./util")

    router.get('/', tokenValidator, (req, res) => {
           
        res.json({ msg: "Login OK" })

    })

    router.get('/status', (req, res) => {
           
        res.json({ msg: "Service OK" })
        
    })
    
module.exports = router;
