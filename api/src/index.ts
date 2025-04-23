import express, { Request, Response } from 'express';
import 'dotenv/config'
import connectDB from './config/dbConnection';
import userRouter from './routes/user.route';
import { StreamChat } from 'stream-chat';

const {PORT,STREAM_API_KEY,STREAM_SECRET_KEY} = process.env ;
export const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_SECRET_KEY)



const app = express();
app.use(express.json());

app.get("/",(req: Request,res: Response) => {
  res.send("hello World")
})
app.use("/user",userRouter);

app.listen(PORT,async() => {
  await connectDB();
  console.log(`Server is running at http://localhost:${PORT}`)
})