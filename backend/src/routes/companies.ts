import express from "express"
import jwt from 'jsonwebtoken'
import config from "../config.js"
import { collections } from "../modules/mongo.js"
import { User } from "./user.js"
import Company from "../schemas/company.js"
import cors from "cors"

const router = express.Router()
router.use(cors())
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
                if(!companyData || !companyData.name || !companyData.cr || !companyData.address || !companyData.contact.number || !companyData.contact.person || !companyData.attachment || !companyData.clients || companyData.name == '' || companyData.cr == '' || companyData.address == '' || companyData.contact.number == '' || companyData.contact.person == '') return res.json({error: 'Invalid Company Input', code: 404})
                const companyX = await collections.companies.findOne({cr: companyData.cr})
                const clientX = await collections.clients.findOne({cr: companyData.cr})
                const companyY = await collections.companies.findOne({contact: {number: companyData.contact.number}})
                if(companyX || companyY || clientX) {
                    return res.json({error: 'The company/client with this CR or Phone Number already exists', code: 402})
                } else {
                    await collections.companies.insertOne(companyData)
                    return res.json({msg: 'Success', code: 200})
                }
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
                let oldCompany = await collections.companies.findOne({cr: companyData.cr})
                if(!companyData || !companyData.name || !companyData.cr || !companyData.address || !companyData.contact.number || !companyData.contact.person || !companyData.attachment || !companyData.clients) return res.json({error: 'Invalid Company Input', code: 404})
                if(oldCompany) {
                    oldCompany.address = companyData.address
                    oldCompany.attachment = companyData.attachment
                    oldCompany.clients = companyData.clients
                    oldCompany.contact = companyData.contact
                    oldCompany.cr = companyData.cr
                    oldCompany.name = companyData.name
                    await collections.companies.updateOne({cr: companyData.cr}, {$set: oldCompany})
                    return res.json({msg: 'Success', code: 200})
                } else return res.json({error: 'No company found', code: '404'})
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
                let company = await collections.companies.findOne({cr: data.cr})
                if(company) {
                    company.clients.map(async (clientId) => {
                        const client = await collections.clients.findOne({id: clientId})
                        if(client) {
                            client.contracts.map((contractId) => {
                                collections.contracts.deleteOne({id: contractId})
                            })
                            collections.clients.deleteOne({id: clientId})
                        } else res.json({error: `Client ${clientId} not found in database.`, code: 404})
                    })
                } else res.json({error: `Company not found`, code: 404})
                collections.companies.deleteOne({cr: data.cr})
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
                const companies = await collections.companies.find().toArray()
                return res.json({data: companies, code: 200})
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
router.get("/fetch/specific", async (req, res) => {
    const data = req.query as {token: string, cr: string}
    try {
        const token = data.token
        if (!token || !data.cr) {
            return res.json({ error: 'Token/CR is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if(verified) {
            const user = collections.user.findOne({username: verified.username, password: verified.password })
            if(!user) {
                return res.json({error: 'Invalid Username/Password', code: 401})
            } else {
                const company = await collections.companies.findOne({cr: data.cr})
                if(company) {
                    return res.json({data: company, code: 200})
                } else return res.json({error: 'Company not found', code: 404})
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