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

router.post("/pay", async (req, res) => {
    const data = req.body
    let contractData = data.contract as Contract
    const installmentIndex = data.installmentIndex
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
                    return res.json({ error: 'Invalid Contract/Installment Object/Value/None found', code: 404 });
                }
                let contract = await collections.contracts.findOne({id: contractData.id})
                if(contract) {
                    contract.installments[installmentIndex].paid = true
                    await collections.contracts.updateOne({id: contractData.id}, {$set: contract})
                    await collections.foreverContracts.updateOne({id: contractData.id}, {$set: contract})
                    return res.json({msg: 'Success', code: 200})
                } else res.json({error: 'No Contract found', code: 404})
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