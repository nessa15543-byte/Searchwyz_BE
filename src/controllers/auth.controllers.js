import { hashSync } from "bcrypt"
import { error } from "console"

export const register = (req, res) =>{
    try{
        const { email, firstName, lastName, password} = req.body;

        if(!firstName) return res.status(400).json({error:"firstname is required"});
        if(firstName.length < 3) return res.status(400).json({error:"firstname must not be less than 3 characters"});
        if(firstName.length > 10) return res.status(400).json({error:"firstname must not be more than 20 characters"});
        if(!isNaN(firstName))return res.status(400).json({error:"firstname must be a string"});

        if(!lastName) return res.status(400).json({error:"lastname is rerquired"});
        if(lastName.length < 3)return res.status(400).json ({error:"lastname must not be less than 3 characters"});
        if(lastName.length > 10)return res.status(400).json ({error:"lastname must not be more than 20 characters"});
        if(!isNaN(lastName))return res.status(400).json ({error:"lastname must be a string"});

        if(!email) return res.status(400).json({error:"Email is required"});
        if(!email.includes("@")) res.status(400).json({error:"invalid email"})
        
        if(!password) return res.status(400).json({error:"password is required"});
        if(password.length < 8) return res.status(400).json({error:"password must be not be less than 8 characters"});
        const hashedPassword = hashSync(password, 10);
        const user ={
            firstName,
            lastName,
            email,
            password: hashedPassword
        };
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
export const forgotPassword = (req,res) =>{
    try{
        const email = req.body.email

        if(!email) return res.status(400).json({error:"Invalid email address"})
        if(!email.includes("@")) return res.status(400).json({error:"Email is invalid"});




    }catch(error){
        res.status(400).json({error:error.message})
    }
}
module.exports = {
    register,
    forgotPassword
}