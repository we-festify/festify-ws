import * as e from 'express';
import { env } from '@/config';
import { docsNav } from '@/constants/docs-nav';
import { AppError, CommonErrors } from '@/utils/errors';

export class DocsController {
  public async getDocsNav(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { topic } = req.params;

      if (topic && !docsNav[topic])
        throw new AppError(
          CommonErrors.NotFound.name,
          CommonErrors.NotFound.statusCode,
          'Docs for this topic not found',
        );

      // get the document navigation
      res.json({
        base_uri: env.docs.base_uri,
        nav: docsNav[topic].nav,
        meta: docsNav[topic].meta,
      });
    } catch (err) {
      next(err);
    }
  }
}
