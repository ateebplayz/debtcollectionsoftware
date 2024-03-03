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

    export default router;