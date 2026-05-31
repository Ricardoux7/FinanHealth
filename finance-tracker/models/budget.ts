import mongoose, { Schema, model, models} from "mongoose";

const budgetSchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  limit: {
    type: Number, 
    required: true, 
    set: (v: number) => Math.round(v * 100) / 100,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  currentSpent: {
    type: Number, 
    required: true, 
    default: 0, 
    set: (v: number) => Math.round(v * 100) / 100,
  },
  startDate: {type: Date, required: true, default: Date.now},
  endDate: {type: Date, default: null},
  status: {
    type: String, 
    required: true, 
    enum: ['active', 'completed', 'overdue'], 
    default: 'active'
  }
})

const Budget = models.Budget || model('Budget', budgetSchema);

export default Budget;