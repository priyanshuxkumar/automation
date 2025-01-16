import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route";
import { workflowRouter } from "./routes/workflow.route";
import { triggerRouter } from "./routes/trigger.route";
import { actionRouter } from "./routes/action.route";
import cookieParser from "cookie-parser"
dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/workflow", workflowRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

app.listen(PORT , () => {
    console.log("Server is listening on PORT:", PORT);
})