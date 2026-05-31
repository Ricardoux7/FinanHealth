import mongoose, { Schema, model, models} from "mongoose";

const expenseSchema = new Schema({
  amount: {type: Number, required: true, 
    set: (v: number) => Math.round(v * 100) / 100,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String, required: true
  },
  type: {type: String, required: true, enum: ['casual', 'budget']},
  date: {type: Date, required: true, default: Date.now},
  description: {
    type: String, required: false
  }
})

const Expense = models.Expense || model('Expense', expenseSchema);

export default Expense;