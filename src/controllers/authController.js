const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/user')
/**
 * @desc Login 
 * @route POST/auth
 * @access public
 */



const login = async (req, res, next) => {
    const{username,password} = req.body

    if (!username || !password) {
        return res.status(400).json({success: false,Message:'All fields are required'})
    }
    const userFound = await user.findOne({username}).exec()

    if(!userFound || !userFound.active) {
         return res.status(401).json({success: false,Message:'Unauthenticated'})
}
    const match = await bcrypt.compare(password, userFound.password)

    if(!match)
        return res.status(401).json({success: false,Message:'Unauthenticated'})

    const accessToken = jwt.sign({
        UserInfo:{ username:userFound.
            username,name:userFound.name,
            role:userFound,
        }
    }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1d'}
    )  

    res.status(200).json({success: true,accessToken,user:userFound})

}    

/**
 * Logout
 * @route POST/ auth/logout
 * @access public
 */
const logout = (req, res) => {
    res.json({success: true,Message:'Logout Success'})
}

module.exports={login,logout}