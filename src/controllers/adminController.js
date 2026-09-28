import mongoose from "mongoose";
import Case from "../models/Case.js";
import User from "../models/User.js";
// import Settings from "../models/Setting.js";

//-------------------dashboard for all cases----------
export const getDashboardTotal = async (_req, res, next) => {
    try {
        const totalCases = await Case.estimatedDocumentCount();
        const pendingCase = await Case.countDocuments({ status: "Pending Verification" });
        const approvedCase = await Case.countDocuments({ status: "Active" });
        const resolvedCase = await Case.countDocuments({ status: "Person Found" });

        res.status(200).json({ totalCases, pendingCase, approvedCase, resolvedCase })
    } catch (error) {
        next(error);
    }
};
//------------location statics-----------------------
export const getCaseLocationStats = async (req, res, next) => {
    try {
        const locationStats = await Case.aggregate([
            { $match: { caseId: new mongoose.Types.ObjectId(req.params.id) } },
            { $group: { _id: "location", count: { sum: 1 } } }
        ]);
        res.status(200).json({ caseId: req.params.id, rankings: locationStats });
    } catch (error) {
        next(error);
    }
};
//------------------get-registeredUsers---------------
export const getRegisteredUsers = async (_req, res, next) => {
    try {
        const users = await User.find({}, "-password");
        if(!users) return res.status(404).json({error: "Unable to execute request"});
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
//------------ see pending-cases-----------------
export const getPendingCases = async (_req, res, next) => {
    try {
        const pendingCase = await Case.find({ status: "Pending Verification" });
        res.status(200).json(pendingCase);
    } catch (error) {
        next(error);
    }
};
//-------------update case status------------------
export const updateCaseStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatus = [
            "Pending Verification",
            "Active",
            "Under Investigation",
            "Person Found",
            "Closed",
            "Rejected",
        ];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedStatus = await Case.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedStatus) {
            return res.status(404).json({ message: "Case profile not found" });
        }
        res.status(200).json({ message: `Case status changed to ${status}`, updatedStatus });
    } catch (error) {
        next(error);
    }
};
//------------pending/approve/reject/delete cases(post)-----------
export const approveCase = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndUpdate(
            req.params.id,
            { status: "approved", updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        res.status(200).json({ success: true, message: "Post approved successfully and is now public", post });
    } catch (error) {
        next(error);
    }
};
export const rejectCase = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndUpdate(
            req.params.id,
            { status: "rejected", updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        res.status(200).json({ success: true, message: "Post content rejected and hidden from search", post });
    } catch (error) {
        next(error);
    }
};
export const pendingCase = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndUpdate(
            req.params.id,
            { status: "Pending verification", updatedAt: Date.now() },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        res.status(200).json({ message: "Post is pending", post });
    } catch (error) {
        next(error);
    }
};
export const deleteCase = async (req, res, next) => {
    try {
        const post = await Case.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post record not found" });
        }
        await clue.deleteMany({ caseId: req.params.id });
        res.status(200).json({ success: true, message: "Case deleted permanently" });
    } catch (error) {
        next(error);
    }
};
//-------------request additional info from reporter-------------
export const requestReporterAdditionalInfo = async (req, res, next) => {
    try {
        const { message } = req.body;
        const currentCase = await Case.findByIdAndUpdate(
            req.params.id,
            { infoRequested: true, adminNote: message },
            { new: true }
        );
        if (!currentCase) {
            return res.status(404).json({ message: "Case not found" });
        }
        res.status(200).json({ message: "Additional context request logged to reporter profile" });
    } catch (error) {
        next(error);
    }
};
//-----------------delete user account permanently--------------
export const deleteUserAcct = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.params.id;

        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: "Self-deletion via dashboard is forbidden. Contact database administrator." });
        }

        const user = await User.findByIdAndDelete(userId).session(session);
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
//------------------clues--------------------
export const allClues = async (_req, res, next) => {
    try{
        const all = await clue.find({}).select("-passwords");
        if(!all) {
            return res.status(404).json({ message: "No clue records found"});
        }
        res.status(200).json(all);
    }catch(error){
        next(error);
    }
};
export const getPendingClues = async (_req, res, next) => {
    try {
        const clues = await Case.find({ status: "Pending Verification" }).populate("caseId", "title");
        res.status(200).json(clues);
    } catch (error) {
        next(error);
    }
};
export const updateClueStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['verified', 'rejected', 'require review'].includes(status)) return res.status(400).json({ message: "Invalid state." });

        const updatedClue = await Case.findByIdAndUpdate(
            req.params.id,
            { status }, { new: true }
        );
        if (!updatedClue) {
            return res.status(404).json({ message: "Clue entry not found." });
        }
        res.status(200).json({ message: `Clue marked as ${status}`, updatedClue });
    } catch (error) {
        next(error);
    }
};
//-------------spam report------------------
export const restrictUserAcct = async (req, res, next) => {
    try {
        const { isRestricted, restrictionReason } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isRestricted, restrictionReason },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User account not found." });
        }
        res.status(200).json({ message: "Account restriction state updated.", user });
    } catch (error) {
        next(error);
    }
};
//---------------update system setting---------------
// export const updateSystemSetting = async (req, res, next) => {
//     try {
//         const setting = await Settings.findOneAndUpdate(
//             {},
//             { $set: req.body },
//             { new: true, upsert: true }
//         );
//         res.status(200).json({ message: "System  updates saved", setting });
//     } catch (error) {
//         next(error);
//     }
// };