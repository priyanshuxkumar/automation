import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route";
import { workflowRouter } from "./routes/workflow.route";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/workflow", workflowRouter);

app.listen(PORT , () => {
    console.log("Server is listening on PORT:", PORT);
})