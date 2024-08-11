import { Schema, model, Document } from 'mongoose';

interface ISafeRoom extends Document {
    address: {
        city: string;
        street: string;
        number: number;
        floor?: number;
        apartment?: number;
    };
    location: {
        lng: number;
        lat: number;
    };
    images: string[];
    capacity: number;
    ownerId: Schema.Types.ObjectId;
    description: string;
    available: boolean;
    accessible: boolean;
    isPublic: boolean;
}

const safeRoomSchema = new Schema<ISafeRoom>({
    address: {
        city: {
            type: String,
            required: true,
            trim: true,
        },
        street: {
            type: String,
            required: true,
            trim: true,
        },
        number: {
            type: String,
            required: true,
            trim: true,
        },
        floor: {
            type: String,
            trim: true,
        },
        apartment: {
            type: String,
            trim: true,
        },
    },
    location: {
        lng: {
            type: Number,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        },
    },
    images: [{
        type: String,
    }],
    capacity: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    accessible: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const SafeRoom = model<ISafeRoom>('SafeRoom', safeRoomSchema);

export default SafeRoom;
