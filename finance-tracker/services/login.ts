import dbConnect from '@/lib/mongodb';
import User from '@/models/users';

export async function loginUser(loginData: any) {
  await dbConnect();
  const { email, password, id } = loginData;

  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error("The user does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  return {
    message: "Login successful",
    user: {
      username: user.username,
      email: user.email,
      id: user._id
    }
  };
}