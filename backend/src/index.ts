import cors from 'cors';
import express from 'express';
import userRoute from './routes/user';
import companyRoute from './routes/companies';
import filesRoute from './routes/files';
import contractsRoute from './routes/contracts'
import clientsRoute from './routes/clients';
import { mongoClient } from './modules/mongo';
import path from 'path';

const app = express();
app.use(cors());

mongoClient.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(console.log);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, '..', 'uploads')));

app.use("/api/user", userRoute);
app.use("/api/companies", companyRoute);
app.use("/api/files", filesRoute);
app.use("/api/clients", clientsRoute);
app.use("/api/contracts", contractsRoute);

app.listen(8080, () => {
	console.log('Server started on port 8080');
});
