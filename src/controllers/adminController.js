import mongoose from "mongoose";
import Case from "../models/Case";
import User from "../models/User";

export const approvePost = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true, runValidators: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        res.status(200).json({ success: true, message: "Post approved successfully", data: post });
    } catch (error) {
        next(error);
    }
};
export const rejectPost = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true, runValidators: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        res.status(200).json({ success: true, message: "Post content rejected", data: post });
    } catch (error) {
        next(error);
    }
};
export const deletePost = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        res.status(200).json({ success: true, message: "Post permanently deleted from database" });
    } catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.params.id;

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User account not found" });
        }
        await Case.deleteMany({ author: userId }).session(session);
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "User and all associated content dropped successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
