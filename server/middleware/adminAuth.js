import jwt from 'jsonwebtoken'

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, msg: "No token, authorization denied" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, msg: "Token is not valid" });
        }

        console.log("HEADERS:", req.headers);

        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: "Token is not valid" });
    }
}
    
export default adminAuth