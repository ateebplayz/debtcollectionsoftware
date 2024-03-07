import express from "express"
import jwt from 'jsonwebtoken'
import config from "../config.js"
import { collections } from "../modules/mongo.js"
import cors from "cors"
export interface User {
    username: string,
    password: string,
}


const router = express.Router()

router.use(cors())
router.use(express.json())

router.get("/authenticate", async (req, res) => {
    const username = req.query.username
    const password = req.query.password

    try {
        let object = {}
        const userDoc = await collections.user.findOne({username: username})
        if(userDoc) {
            if(userDoc.password == password) {
                const token = jwt.sign(userDoc, config.jwtKey)
                object = {
                    token: token,
                    code: 200,
                }
            } else {
                object = {
                    token: 'N/A',
                    code: 401
                }
            }
        } else {
            object = {
                token: 'N/A',
                code: 404
            }
        }
        return res.json(object)
    } catch {console.log}
})
router.post("/reset", async(req, res) => {
    const password = req.body.password as string
    const backupCode = req.body.backupCode as string
    if(!password || !backupCode) {
        return res.json({error: 'Invalid Password or Backup Code', code: 403})
    } else {
        const backupDoc = await collections.backup.findOne({code: backupCode})
        console.log(await collections.backup.find().toArray(), backupCode, backupDoc)
        if(backupDoc) {
            collections.user.updateOne({
                username: 'administrator'
            }, {$set: {
                username: 'administrator',
                password: password
            }})
            collections.backup.deleteOne({code: backupCode})
            return res.json({data: 'Success', code: 200})
        } else return res.json({error: 'Backup code is incorrect/not found', code: 404})
    }
})
export default router;