const DigitalCard = require("../models/DigitalCard");
const User = require("../models/User");
const deleteImageFromCloudinary = require("../util/deleteImageFromCloudinary");

const createDigitalCard = async (req, res) => {
    try {
        const existingDigitalCards = await DigitalCard.findOne({ userID: req.userID });
        if (existingDigitalCards) {
            return res.status(400).json({
                ok: false,
                message: "Digital Card already exists"
            });
        }

        const digitalCard = new DigitalCard({
            ...req.body, userID: req.userID
        });

        await digitalCard.save();
        await User.updateOne({ _id: req.userID }, { $set: { hasDigitalCard: true } });
        res.status(201).json({
            ok: true,
            message: "Digital Card Created",
            digitalCard: digitalCard
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: err.message,
        });
    }
}

const deleteDigitalCard = async (req, res) => {
    try {
        const digitalCard = await DigitalCard.findOne({ userID: req.userID });
        if (!digitalCard) {
            return res.status(400).json({
                ok: false,
                message: "Digital Card does not exist"
            });
        }
        const isDeleted = await deleteImageFromCloudinary(digitalCard.imgId);
        if (!isDeleted) {
            return res.status(500).json({
                ok: false,
                message: "Error deleting old image from cloudinary"
            });
        }

        await digitalCard.deleteOne();
        await User.updateOne({ _id: req.userID }, { $set: { hasDigitalCard: false } });
        res.status(200).json({
            ok: true,
            message: "Digital Card Deleted"
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Internal Server Error",
            err: err.message
        });
    }
}


const updateDigitalCard = async (req, res) => {
    try {
        let newDigitalCard = req.body;
        const digitalCard = await DigitalCard.findOne({ userID: req.userID });
        if (!digitalCard) {
            return res.status(400).json({
                ok: false,
                message: "Digital Card does not exist"
            });
        }

        if (req.file) {
            const isDeleted = await deleteImageFromCloudinary(digitalCard.imgId);
            if (!isDeleted) {
                return res.status(500).json({
                    ok: false,
                    message: "Error deleting old image from cloudinary"
                });
            }
        } else {
            newDigitalCard = { ...newDigitalCard, imgId: digitalCard.imgId };
        }


        await digitalCard.replaceOne({ ...newDigitalCard, userID: req.userID });
        res.status(200).json({
            ok: true,
            message: "Digital Card Updated",
            digitalCard: { ...newDigitalCard, userID: req.userID }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            message: "Internal Server Error",
            err: err.message
        });
    }
}


const getDigitalCard = async (req, res) => {
    try {
        const userCardID = req.params.userCardID;
        const digitalCard = await DigitalCard.findOne({ userID: userCardID });
        if (!digitalCard) {
            return res.status(400).json({
                ok: false,
                message: "Digital Card does not exist"
            });
        }
        res.status(200).json({
            ok: true,
            message: "Digital Card Retrieved",
            digitalCard: digitalCard
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            message: "Internal Server Error",
            err: err.message
        });
    }
}
module.exports = {
    createDigitalCard,
    deleteDigitalCard,
    updateDigitalCard,
    getDigitalCard
};