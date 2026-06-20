import jwt from "jsonwebtoken";

export const verifyToken = async (req,res,next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"No token provided"})
    }
    
    const token = authHeader.split(" ")[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({message:"Invalid or expired token"})
        }

        req.user = user;
        next();
    })
}