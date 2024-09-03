import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
  },
  { timestamps: true },
);

const UserModel = model('User', userSchema);
export default UserModel;
