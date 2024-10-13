import * as e from 'express';
import { env } from '@/config';
import { docsNav } from '@/constants/docs-nav';
import { AppError, CommonErrors } from '@/utils/errors';

export class DocsController {
  public async getDocsNavForService(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { service } = req.params;

      if (service && !docsNav[service])
        throw new AppError(
          CommonErrors.NotFound.name,
          CommonErrors.NotFound.statusCode,
          'Service not found',
        );

      // get the document navigation
      res.json({
        base_uri: env.docs.base_uri + '/' + service,
        nav: docsNav[service],
      });
    } catch (err) {
      next(err);
    }
  }
}
