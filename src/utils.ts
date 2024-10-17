import mongoose from "mongoose";


export function isValidId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}