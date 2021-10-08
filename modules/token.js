const { v4: uuidv4 } = require('uuid');

exports.create = () => {
    console.log("\nTokens Generados \n\n"+uuidv4())
    console.log(uuidv4()+"\n\n")
}