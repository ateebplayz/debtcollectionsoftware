import express from "express"
import jwt from 'jsonwebtoken'
import config from "../config.js"
import { collections } from "../modules/mongo.js"
import { User } from "./user.js"
import { generateTenDigitString } from "../modules/helpers.js"
import Contract from "../schemas/contract.js"

const router = express.Router()
router.use(express.json())
router.post("/create", async (req, res) => {
    const data = req.body
    let contractData = data.contract as Contract
    contractData.id = generateTenDigitString()
    try {
        const token = data.token
        if (!token) {
            return res.json({ error: 'Token is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if(verified) {
            const user = collections.user.findOne({username: verified.username, password: verified.password })
            if(!user) {
                return res.json({error: 'Invalid Username/Password', code: 401})
            } else {
                if (!contractData || !Object.values(contractData).every(value => value !== '')) {
                    return res.json({ error: 'Invalid Contract Object/None found', code: 404 });
                }
                await collections.contracts.insertOne(contractData)
                return res.json({msg: 'Success', code: 200})
            }
        } else {
            return res.json({error: 'Unknown error occured', code: 0})
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid token format', code: 400 })
        }
        console.error(error)
        return res.json({ error: 'Internal Server Error', code:500 })
    }
})
router.post("/update", async (req, res) => {
    const data = req.body
    const contractData = data.contract as Contract
    try {
        const token = data.token
        if (!token) {
            return res.json({ error: 'Token is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if(verified) {
            const user = collections.user.findOne({username: verified.username, password: verified.password })
            if(!user) {
                return res.json({error: 'Invalid Username/Password', code: 401})
            } else {
                if (!contractData || !Object.values(contractData).every(value => value !== '')) {
                    return res.json({ error: 'Invalid Contaract Object/None found', code: 404 });
                }
                await collections.contracts.updateOne({cr: contractData.id}, {$set: contractData})
                return res.json({msg: 'Success', code: 200})
            }
        } else {
            return res.json({error: 'Unknown error occured', code: 0})
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid token format', code: 400 })
        }
        console.error(error)
        return res.json({ error: 'Internal Server Error', code:500 })
    }
})
router.post("/delete", async (req, res) => {
    const data = req.body as {token: string, id: string}
    try {
        const token = data.token
        if (!token) {
            return res.json({ error: 'Token is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if(verified) {
            const user = collections.user.findOne({username: verified.username, password: verified.password })
            if(!user) {
                return res.json({error: 'Invalid Username/Password', code: 401})
            } else {
                if(!data.id) return res.json({error: 'Invalid Contract ID/None found', code: 404})
                await collections.contracts.deleteOne({cr: data.id})
                return res.json({msg: 'Success', code: 200})
            }
        } else {
            return res.json({error: 'Unknown error occured', code: 0})
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid token format', code: 400 })
        }
        console.error(error)
        return res.json({ error: 'Internal Server Error', code:500 })
    }
})
router.get("/fetch", async (req, res) => {
    const data = req.query as {token: string}
    try {
        const token = data.token
        if (!token) {
            return res.json({ error: 'Token is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if(verified) {
            const user = collections.user.findOne({username: verified.username, password: verified.password })
            if(!user) {
                return res.json({error: 'Invalid Username/Password', code: 401})
            } else {
                const contracts = await collections.contracts.find().toArray()
                return res.json({data: contracts, code: 200})
            }
        } else {
            return res.json({error: 'Unknown error occured', code: 0})
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid token format', code: 400 })
        }
        console.error(error)
        return res.json({ error: 'Internal Server Error', code:500 })
    }
})
export default router;