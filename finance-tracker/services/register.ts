import dbConnect from '@/lib/mongodb';
import User from '@/models/users';

export async function registerUser(userData: any) {
  await dbConnect();
  
  const { username, email, password } = userData;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("The email or username is already in use");
  }
  const newUser = new User({
    username,
    email,
    passwordHash: password, 
  });

  await newUser.save();
  return { message: "User registered successfully" };
}