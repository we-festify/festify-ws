import express from 'express';
import fs from 'fs';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';

// middlewares
import { AuthMiddleware } from '@/api/middlewares/authentication';
import { AuthZMiddleware } from '@aim/api/middlewares/auth-z';
import { AppError, CommonErrors } from '@/utils/errors';

import ManagedUser from '@aim/models/managed-user';
import PermissionPolicy from '@aim/models/permission-policy';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const authZMiddleware = new AuthZMiddleware(ManagedUser, PermissionPolicy);

// require authentication for all routes
router.use(authMiddleware.requireAuthenticated.bind(authMiddleware));

// register the routes for all handlers (in the handlers folder)
const handlerFiles = fs.readdirSync(__dirname + '/../handlers');
handlerFiles.forEach(async (file) => {
  if (!file.endsWith('.ts') && !file.endsWith('.js')) return;
  const imported = await import(__dirname + '/../handlers/' + file);
  const actionName = imported.name as string;
  router.post(
    '/' + actionName,
    authZMiddleware
      .canExecuteActionOnResource(`bes:${actionName}`)
      .bind(authZMiddleware),
    async (req, res, next) => {
      try {
        const data = req.body.data;
        const resource = req.body.resource;

        const user = req.user;
        const context = { user };

        // validate the request data
        const validator = imported.validator as ValidatorFunction<null, null>;
        if (!validator(resource, data)) {
          throw new AppError(
            CommonErrors.BadRequest.name,
            CommonErrors.BadRequest.statusCode,
            'Invalid request data',
          );
        }

        // execute the handler
        const handle = imported.default as HandlerFunction<null, null>;
        const result = await handle(resource, data, context);

        res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
});

export default router;
