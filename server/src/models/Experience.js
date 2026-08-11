import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
      unique: true,
      sparse: true,
    },
    shortDesc: {
      vi: { type: String, default: '', trim: true, maxlength: 300 },
      en: { type: String, default: '', trim: true, maxlength: 300 },
    },
    role: {
      vi: { type: String, required: true, trim: true, maxlength: 200 },
      en: { type: String, default: '', trim: true, maxlength: 200 },
    },
    period: {
      vi: { type: String, required: true, trim: true, maxlength: 100 },
      en: { type: String, default: '', trim: true, maxlength: 100 },
    },
    bullets: {
      vi: { type: [String], default: [] },
      en: { type: [String], default: [] },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.Experience ?? mongoose.model('Experience', experienceSchema)
