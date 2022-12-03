const jwt=require("jsonwebtoken");

module.exports=function verifyToken(req, res, next) {
    if (req.headers.authorization !== undefined) {

        let token = (req.headers.authorization.split(" ")[1])

        jwt.verify(token, "secretkey", (err, data) => {
            if (err === null || err === undefined) {
                next();
            }
            else {
                res.send({ message: "Incorrect token" })
            }
        })
    }
    else {
        res.send({ message: "Authorization headers is required" })
    }

}
