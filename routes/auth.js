const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../secret.js')
// const requireSignin = require('../middleware/requireSignin')


router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!name||!email||!password){
        return res.status(400).json({error: 'please add all required fields'})
    }
    //res.json({message:'successfully posted'})
    User.findOne({email:email})
    .then(
        (savedUser) => {
            if(savedUser != null) {
                return res.status(400).json({error: "User is already exists with that email"})
            }
            bcrypt.hash(password,12)
            .then(
                (hashedPassword) => {
                    const user = new User({
                        name,
                        email,
                        password : hashedPassword
                    })
                    user.save()
                    .then(
                        (user) => {
                            res.json({message: "saved successfully"})
                        }
                        )
                        .catch(
                            err =>{
                                console.log(err)
                            }
                            )
                }
                )
            
            
        }
    ).catch(
        err =>{
            console.log(err)
        }
    )




})


router.post('/signin', (req, res) => {
    //console.log(req.body)
    const {email,password} = req.body
    if(!email||!password){
        return res.status(400).json({error: "please add email or password"})
    } 
    User.findOne({email: email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(400).json({error:"invalid email or password"})
        }
        // console.log(savedUser)
        bcrypt.compare(password, savedUser.password)
        .then(
            (doMatch)=>{
                if(doMatch) {
                    const token =jwt.sign({_id: savedUser._id}, JWT_SECRET)
                    res.json({message: "successfully signed in",token:token})
                }
                else{
                    return res.status(400).json({error: "failed to sign in"})  
                }
            }
        )
    })
})

// router.get('/topsecret',requireSignin,(req, res) => {
//         // console.log(req.headers)
//         // console.log(req.user)
//         res.send("let talk on call")
// })

module.exports = router