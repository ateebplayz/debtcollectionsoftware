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
router.use(cors())

router.get("/fetch", async (req, res) => {
    const data = req.query as { token: string, type: 'client' | 'company' | 'overall', key: string, dateto: string, datefrom: string }
    try {
        const token = data.token
        if (!token) {
            return res.json({ error: 'Token is missing', code: 404 })
        }
        const verified = jwt.verify(token, config.jwtKey) as User
        if (verified) {
            const user = collections.user.findOne({ username: verified.username, password: verified.password })
            if (!user) {
                return res.json({ error: 'Invalid Username/Password', code: 402 })
            } else {
                if (!data.key) return res.json({ error: 'Invalid Client ID/Company CR provided', code: 402 })
                if (data.type == 'client' || data.type == 'company' || data.type == 'overall') {
                    let dataArr: Array<Contract> = []
                    switch (data.type) {
                        case 'client':
                            dataArr = await collections.foreverContracts.find({ clientId: data.key }).toArray()
                            break
                        case 'company':
                            if (!data.token) return res.json({ error: 'Invalid Type entered, please use either client company or overall' })
                            if (data.datefrom !== '00-00-0000' && data.dateto !== '00-00-0000') {
                                dataArr = await collections.foreverContracts.find({
                                    companyCr: data.key,
                                    date: { $gte: data.datefrom, $lte: data.dateto }
                                }).toArray()
                            } else if (data.datefrom !== '00-00-0000') {
                                dataArr = await collections.foreverContracts.find({
                                    companyCr: data.key,
                                    date: { $gte: data.datefrom }
                                }).toArray()
                            } else {
                                dataArr = await collections.foreverContracts.find({ companyCr: data.key }).toArray()
                            }
                            break
                        case 'overall':
                            dataArr = await collections.foreverContracts.find().toArray()
                            break
                    }
                    return res.json({ data: dataArr, code: 200 })
                } else return res.json({ error: 'Invalid type provided. Must be either `client` or `company`', code: 402 })
            }
        } else {
            return res.json({ error: 'Unknown error occured', code: 0 })
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.json({ error: 'Invalid token format', code: 400 })
        }
        console.error(error)
        return res.json({ error: 'Internal Server Error', code: 500 })
    }
})

export default router;