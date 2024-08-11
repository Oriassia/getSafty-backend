import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    safeRooms: Schema.Types.ObjectId[];
    favorites: Schema.Types.ObjectId[];
    phoneNumber: string;
    profilePicture?: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    safeRooms: [{
        type: Schema.Types.ObjectId,
        ref: 'SafeRoom',
    }],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'SafeRoom',
    }],
    phoneNumber: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const User = model<IUser>('User', userSchema);

export default User;



