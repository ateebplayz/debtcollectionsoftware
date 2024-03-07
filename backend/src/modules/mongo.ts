import config from '../config'
import { MongoClient } from 'mongodb'
import Client from '../schemas/client'
import Contract from '../schemas/contract'
import Company from '../schemas/company'

export const mongoClient = new MongoClient(config.mongoUri)
export const db = mongoClient.db('DebtCollection')
export const collections = {
    user: db.collection<{username: string, password: string,}>('Users'),
    clients: db.collection<Client>('Clients'),
    contracts: db.collection<Contract>('Contracts'),
    companies: db.collection<Company>('Companies'),
    backup: db.collection<{code: string}>('Backups')
}