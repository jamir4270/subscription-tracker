import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { cancelSubscription, createSubscription, deleteSubscription, getAllSubscriptions, getUserSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: "GET subscription by id" });
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/users/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({ title: "GET upcoming renewals" });
});

export default subscriptionRouter;