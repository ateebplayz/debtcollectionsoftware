import cors from 'cors'
import express from 'express';
import userRoute from './routes/user'
import companyRoute from './routes/companies'
import { mongoClient } from './modules/mongo';

const app = express();
app.use(cors())
mongoClient.connect().then(() => {
    console.log('Connected to MongoDB')
}).catch(console.log)
app.use("/api/user", userRoute);
app.use("/api/companies", companyRoute)

app.listen(8080, () => {
	console.log('Server started on port 8080');
});