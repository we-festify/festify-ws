import mongoose from 'mongoose';
import {
  IMethodsHandler,
  MethodsHandlerRuntime,
} from '@sharedtypes/methods/handler';

const methodsHandlerSchema = new mongoose.Schema<IMethodsHandler>(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    alias: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    timeoutInSeconds: {
      type: Number,
      required: true,
      default: 3,
    },
    memoryInMB: {
      type: Number,
      required: true,
      default: 8,
    },
    codeSource: {
      type: String,
      required: true,
      select: false,
    },
    codeHash: {
      type: String,
      required: true,
    },
    codeSizeInBytes: {
      type: Number,
      required: true,
    },
    runtime: {
      type: String,
      required: true,
      enum: Object.values(MethodsHandlerRuntime),
    },
  },
  { timestamps: true },
);

const MethodsHandler = mongoose.model<IMethodsHandler>(
  'MethodsHandler',
  methodsHandlerSchema,
);
export default MethodsHandler;
