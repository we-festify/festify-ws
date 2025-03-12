import express from 'express';
import { AuthMiddleware } from '@/api/middlewares/authentication';
import { AuthZMiddleware } from '@aim/api/middlewares/auth-z';
import { AppError, CommonErrors } from '@/utils/errors';
import ManagedUser from '@aim/models/managed-user';
import PermissionPolicy from '@aim/models/permission-policy';
import { logger } from '@/utils/logger';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';

// Import all handlers from the generated index
// This is generated by the prebuild script
import * as handlersModules from '../handlers/index';

interface HandlerModule {
  name: string;
  default: HandlerFunction<null, null>;
  validator: ValidatorFunction<null, null>;
}

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const authZMiddleware = new AuthZMiddleware(ManagedUser, PermissionPolicy);

// Require authentication for all routes
router.use(authMiddleware.requireAuthenticated.bind(authMiddleware));

// Register all handlers
const registerHandlers = () => {
  const startTimer = Date.now();

  try {
    // Use type assertion to tell TypeScript what the structure is
    const modules = Object.values(
      handlersModules,
    ) as unknown as HandlerModule[];

    modules.forEach((handlerModule) => {
      // Skip modules that don't match our interface structure
      if (!handlerModule || typeof handlerModule !== 'object') {
        return;
      }

      const actionName = handlerModule.name;

      // Skip if missing required exports
      if (!actionName || !handlerModule.default || !handlerModule.validator) {
        logger.warn(
          `[Methods] Skipping handler "${handlerModule.name}" due to missing exports`,
        );
        return;
      }

      const authZCheck = authZMiddleware
        .canExecuteActionOnResource(`Methods:${actionName}`)
        .bind(authZMiddleware);

      router.post(`/${actionName}`, authZCheck, (req, res, next) => {
        try {
          const { data, resource } = req.body;
          const context = { user: req.user };
          const validator = handlerModule.validator;
          const handler = handlerModule.default;

          if (!validator(resource, data)) {
            throw new AppError(
              CommonErrors.BadRequest.name,
              CommonErrors.BadRequest.statusCode,
              'Invalid request data',
            );
          }

          handler(resource, data, context)
            .then((result) => res.status(200).json(result))
            .catch(next);
        } catch (err) {
          next(err);
        }
      });
    });

    logger.info(`[Methods] handlers loaded (${Date.now() - startTimer}ms)`);
  } catch (err) {
    logger.error(
      '[Methods] Error loading handlers, check the generated index file:',
      err,
    );
  }
};

// Register handlers immediately
registerHandlers();

export default router;
