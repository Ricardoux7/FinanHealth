import mongoose, { Schema, model, models} from "mongoose";

const incomeSchema = new Schema({
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
  source: {
    type: String, required: true
  },
  date: {type: Date, required: true, default: Date.now},
  description: {
    type: String, required: false
  }
})

const Income = models.Income || model('Income', incomeSchema);

export default Income;