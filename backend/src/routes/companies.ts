import express from "express"
import jwt from 'jsonwebtoken'
import config from "../config.js"
import { collections } from "../modules/mongo.js"
import { User } from "./user.js"
import Company from "../schemas/company.js"

const router = express.Router()
router.use(express.json())
router.post("/create", async (req, res) => {
    const data = req.body
    const companyData = data.company as Company
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
                if(!companyData || !companyData.name || !companyData.cr || !companyData.address || !companyData.contact.number || !companyData.contact.person || !companyData.attachment || !companyData.clients) return res.json({error: 'Invalid Company Object/None found', code: 404})
                await collections.companies.insertOne(companyData)
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
    const companyData = data.company as Company
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
                if(!companyData || !companyData.name || !companyData.cr || !companyData.address || !companyData.contact.number || !companyData.contact.person || !companyData.attachment || !companyData.clients) return res.json({error: 'Invalid Company Object/None found', code: 404})
                await collections.companies.updateOne({cr: companyData.cr}, {$set: companyData})
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
    const data = req.body as {token: string, cr: string}
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
                if(!data.cr) return res.json({error: 'Invalid Company CR/None found', code: 404})
                await collections.companies.deleteOne({cr: data.cr})
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
export default router;