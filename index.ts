import express from 'express';
import cors from 'cors';
import initializedDatabase from './database/index';
import 'dotenv/config';
import { config } from './config';

const app = express();
const port: number = 2000;

const CorsOptions: {
  origin: string;
  credential: boolean;
} = {
  origin: '*',
  credential: true,
};
app.use(cors(CorsOptions));
app.use(express.json());

app.listen(port, async () => {
  await initializedDatabase();
  console.log(`Server is running on ${port}`);
});
