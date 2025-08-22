import { Schema, model } from 'mongoose';

const ProviderSchema = new Schema({
  provider: String,
  providerId: String
}, { _id: false });

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  picture: String,
  providers: [ProviderSchema],
  createdAt: { type: Date, default: Date.now }
});

export default model('User', UserSchema);
