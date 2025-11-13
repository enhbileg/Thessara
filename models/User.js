import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl : { type: String, required: true},
    cartItems : { type: Object, default: {} },
    preferredTheme: { type: String, default: "light" },
    messages: [
    {
      subject: String,
      message: String,
      createdAt: { type: Date, default: Date.now },
      reply: { type: String, default: "" }, // админы хариу
      repliedAt: { type: Date },
    },
  ],
}, { minimize: false })

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;