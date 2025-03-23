// server/models/Firm.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFirm extends Document {
  name: string;
  code: string;
  description?: string;
  address: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  gstNo: string;
  businessType: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const FirmSchema: Schema<IFirm> = new Schema<IFirm>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  address: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  gstNo: { type: String, required: true },
  businessType: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Avoid model recompilation during hot-reloads
export default (mongoose.models.Firm as Model<IFirm>) || mongoose.model<IFirm>('Firm', FirmSchema);