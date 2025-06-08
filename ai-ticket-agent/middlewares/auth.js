import jwt from "jsonwebtoken"

export const authenticate = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if(!token)
        return res.status(401).json({error: "Access Denied. No token found"})

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        return res.status(401).json({error: "Access denied. Invalid token"})
    }
}