import { collections } from "./modules/mongo";

collections.backup.insertOne({code: ''}).then(()=>{console.log('Done.')})
