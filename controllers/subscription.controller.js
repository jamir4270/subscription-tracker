import Subscription from ".././models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();

        res.status(200).json({
            success: true,
            message: "Subscriptions fetched successfully",
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
}

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        res.status(201).json({
            success: true,
            message: "Subscription successfully created",
            data: {
                subscription,
                workflowRunId,
            },
        }); 
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            sucess: true,
            message: "User subscriptions successfully fetched",
            data: subscriptions,
        })
    } catch(error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const { name, price, currency, frequency, category, paymentMethod, status, startDate, user, createdAt, updatedAt, renewalDate } = req.body;

        const subscription = await Subscription.findByIdAndUpdate(req.params.id, {
            name: name,
            price: price,
            currency: currency,
            frequency: frequency,
            category: category,
            paymentMethod: paymentMethod,
            status: status,
            startDate: startDate,
            user: user,
            createdAt: createdAt,
            updatedAt: updatedAt,
            renewalDate: renewalDate,
        }, { new: true, });

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: subscription,
        })
    } catch(error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);

        if(deletedSubscription) {
            res.status(200).json({
                success: true,
                message: "Subscription deleted successfully",
                data: deletedSubscription,
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }
    } catch(error) {
        next(error);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {

        const subscription = await Subscription.findByIdAndUpdate(req.params.id, {
            status: 'cancelled',
        }, { new: true, });

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription,
        });
    } catch(error) {
        next(error);
    }
}