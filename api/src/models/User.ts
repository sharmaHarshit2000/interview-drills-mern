import { Schema, model, Document } from "mongoose";

interface IProvider {
  provider: string;
  providerId: string;
}

interface IUser extends Document {
  email: string;
  name?: string;
  picture?: string;
  providers: IProvider[];
  createdAt: Date;
}

const ProviderSchema = new Schema<IProvider>(
  {
    provider: String,
    providerId: String,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  name: String,
  picture: String,
  providers: [ProviderSchema],
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>("User", UserSchema);
