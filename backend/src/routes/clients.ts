import express from "express"
import jwt from 'jsonwebtoken'
import config from "../config.js"
import { collections } from "../modules/mongo.js"
import { User } from "./user.js"
import Company from "../schemas/company.js"
import Client from "../schemas/client.js"
import { generateTenDigitString } from "../modules/helpers.js"
import cors from "cors"

const router = express.Router()
router.use(express.json())
router.use(cors())
router.post("/create", async (req, res) => {
    const data = req.body
    let clientData = data.client as Client
    clientData.id = generateTenDigitString()
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
                if (!clientData || !Object.values(clientData).every(value => value !== '')) {
                    return res.json({ error: 'Invalid Client Object/None found', code: 404 });
                }
                let oldCompany = await collections.companies.findOne({cr: clientData.companyCr})
                if(oldCompany) {
                    oldCompany.clients.push(clientData.id)
                    collections.companies.updateOne({cr: clientData.companyCr}, {$set: oldCompany})
                    await collections.clients.insertOne(clientData)
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
    const clientData = data.client as Client
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
                if (!clientData || !Object.values(clientData).every(value => value !== '')) {
                    return res.json({ error: 'Invalid Client Object/None found', code: 404 });
                }
                let client = await collections.clients.findOne({id: clientData.id})
                if(client) {
                    client.address = clientData.address
                    client.attachment = clientData.attachment
                    client.companyCr = clientData.companyCr
                    client.contact = clientData.contact
                    client.contracts = clientData.contracts
                    client.id = clientData.id
                    client.name = clientData.name
                    collections.clients.updateOne({id: clientData.id}, {$set: client})
                    return res.json({msg: 'Success', code: 200})
                } else res.json({error: 'Client not found', code: 404})
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
                if(!data.id) return res.json({error: 'Invalid Client ID/None found', code: 404})
                let client = await collections.clients.findOne({id: data.id})
                if(client) {
                    let company = await collections.companies.findOne({cr: client.companyCr})
                    if(company) {
                        let index = -1
                        company.clients.map((clientId, indexT) => {
                            if(clientId == data.id) index = indexT
                        })
                        if(index !== -1) {
                            company.clients.splice(index, 1)
                            collections.companies.updateOne({cr: company.cr}, {$set: company})
                        } else return res.json({error: 'Client not found in company object', code: 404})
                    } else return res.json({error: 'Client company not found', code: 404})
                    client.contracts.map((contractId) => {
                        return collections.contracts.deleteOne({id: contractId})
                    })
                    collections.clients.deleteOne({id: data.id})
                } else return res.json({error: 'Client not found', code: 404})
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
                const clients = await collections.clients.find().toArray()
                return res.json({data: clients, code: 200})
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