import mongoose, {Schema, model, models} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  balance: {type: Number, default: 0},
  categories: {type: [String], default: []},
  source: {type: [String], default: []},
})

userSchema.pre("save",  async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }
  try{
    const salt = await bcrypt.genSalt();
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
  } catch(err){
    throw err;
  }
})

userSchema.methods.comparePassword = async function (passwordEntered: String) {
  return await bcrypt.compare(passwordEntered as string, this.passwordHash);
}
const User = models.User || model("User", userSchema);

export default User;