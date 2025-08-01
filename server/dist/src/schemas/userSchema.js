import mongoose from "mongoose";
import profileSchema from "./profileSchema.js";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === "local";
        },
    },
    profile: {
        type: profileSchema,
        required: true,
    },
    provider: {
        type: String,
        enum: ["local", "google", "github"],
        default: "local",
    },
    providerId: {
        type: String,
        default: null,
    },
    hobbies: {
        type: [String],
        default: [],
    },
    connections: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
    lastLogin: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastSeen: { type: Date, default: null },
    isOnline: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["online", "away", "busy", "offline"],
        default: "offline",
    },
    socketId: { type: String, default: null },
    profileVisibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    emailVerified: {
        type: Boolean,
        default: function () {
            return this.provider !== "local";
        },
    },
    connectionsRequests: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
}, { timestamps: true, versionKey: false });
export default userSchema;
