import {z} from 'zod'
import { Types } from 'mongoose';

export const zodObjectId = z.string().refine(
  (val) => Types.ObjectId.isValid(val), 
  { message: "Invalid ObjectId" }
);