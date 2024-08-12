import { Schema, model, Document } from 'mongoose';

interface IZone extends Document {
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    countdown: number;
}

const zoneSchema = new Schema<IZone>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    countdown: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const Zone = model<IZone>('Zone', zoneSchema);

export default Zone;
