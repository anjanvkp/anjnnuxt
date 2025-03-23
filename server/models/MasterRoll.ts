import { Schema, model } from 'mongoose'

const masterRollSchema = new Schema({
  employeeName: {
    type: String,
    required: true
  },
  fatherHusbandName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  aadhar: {
    type: String,
    required: true,
    unique: true
  },
  pan: String,
  phoneNo: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  bank: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: false
  },
  accountNo: {
    type: String,
    required: true
  },
  ifsc: {
    type: String,
    required: true
  },
  uan: String,
  esicNo: String,
  sKalyanNo: String,
  category: {
    type: String,
    default: 'HELPER'
  },
  pDayWage: Number,
  project: String,
  site: String,
  dateOfJoining: {
    type: Date,
    required: true
  },
  dateOfExit: Date,
  doeRem: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  firmId: {
    type: Schema.Types.ObjectId,
    ref: 'Firm',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated', 'left'],
    default: 'active',
    required: true
  }
}, {
  timestamps: true
})

export const MasterRoll = model('MasterRoll', masterRollSchema)