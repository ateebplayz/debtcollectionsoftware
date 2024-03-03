import express from "express"
import jwt from 'jsonwebtoken'
import config from "../config.js"
import { collections } from "../modules/mongo.js"
import { User } from "./user.js"
import { generateTenDigitString } from "../modules/helpers.js"
import Contract from "../schemas/contract.js"
import cors from "cors"

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
                let client = await collections.clients.findOne({id: contractData.clientId})
                if(client) {
                    client.contracts.push(contractData.id)
                    await collections.contracts.insertOne(contractData)
                    await collections.clients.updateOne({id: contractData.clientId}, {$set: client})
                    return res.json({msg: 'Success', code: 200})
                } else {
                    return res.json({error: 'Client not found', code: 404})
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
    const data = req.body as {token: string, contract: Contract}
    const contract = data.contract
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
                if(!contract.id) return res.json({error: 'Invalid Contract ID/None found', code: 404})
                let client = await collections.clients.findOne({id: contract.clientId})
                if(client) {
                    let index = -1
                    client.contracts.map((contractId, index) => {
                        if(contractId == contract.id) index = index
                    })
                    if(index == 0) {
                        return res.json({error: 'Client doesnt have contract', code: 404})
                    }
                    client.contracts.splice(index, 1)
                    collections.clients.updateOne({id: client.id}, {$set: client})
                    collections.contracts.deleteOne({id: contract.id})
                    return res.json({msg: 'Success', code: 200})
                } else {
                    return res.json({msg: 'Client not found', code: 404})
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
router.get("/fetch/specific", async (req, res) => {
    const data = req.query as {token: string, requirement: string}
    try {
        const token = data.token
        if (!token) {
            return res.json({ error: 'Token is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if (verified) {
            if (data.requirement == '10d' || data.requirement == 'today' || data.requirement == 'overdue') {
                const contracts = await collections.contracts.find().toArray();
                let returnContracts: Array<{contract: Contract, time: number}> = [];
        
                contracts.forEach((contract, index) => {
                    let timeDifference = Date.parse(contract.date) - Date.now()
                    let timeRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
                    switch(data.requirement) {
                        case '10d':
                            if(timeRemaining <= 10 && timeRemaining >= 1) {
                                returnContracts.push({
                                    contract: contract,
                                    time: timeRemaining
                                })
                            }
                            break
                        case 'today':
                            if(timeRemaining == 0) {
                                returnContracts.push({
                                    contract: contract,
                                    time: timeRemaining
                                })
                            }
                            break
                        case 'overdue':
                            if(timeRemaining < 0) {
                                returnContracts.push({
                                    contract: contract,
                                    time: timeRemaining
                                })
                            }
                            break
                    }
                })
        
                return res.json({ data: returnContracts, code: 200 });
            } else {
                return res.json({ error: 'Invalid requirement/none found. Accepted terms are 10d, today, overdue', code: 200 });
            }
        } else {
            return res.json({ error: 'Unknown error occurred', code: 0 });
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