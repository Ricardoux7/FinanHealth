import mongoose, { Schema, model, models} from "mongoose";

const savingsSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  }
})

const Savings = models.Savings || model('Savings', savingsSchema);

export default Savings;