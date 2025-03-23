// server/models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  role: 'user' | 'manager' | 'admin';
  firmId: mongoose.Types.ObjectId;
  lastmailsent?: Date; // Optional
  lastLogin?: Date; // Optional
  createdAt?: Date; // Add this
  updatedAt?: Date; // Add this
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true },
  lastmailsent: { type: Date },
  lastLogin: { type: Date },
},
{
  timestamps: true,
});

// Avoid model recompilation during hot-reloads
export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);