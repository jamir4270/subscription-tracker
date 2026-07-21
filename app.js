import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT, NODE_ENV } from "./config/env.js";

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

import connectToDatabase from './database/mongodb.js';

import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.use(arcjetMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to SubaDub API!");
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

await connectToDatabase();

if (NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`SubDub API is running on http://localhost:${PORT}`);
    });
}

export default app;