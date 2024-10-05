import { Request, Response, NextFunction } from 'express';

// data
import { docsNav, DocsServiceType } from '../docs';
import { BadRequestError } from '../utils/errors';

// utils
import fs from 'fs';
import path from 'path';

class DocsController {
  static async getDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const { service } = req.params;
      let { path: docsPath } = req.query;
      if (!docsPath) throw new BadRequestError('Path is required');

      // sanitize path
      docsPath = docsPath.toString().trim();

      // get allowed paths
      const allowedPaths = docsNav[service as DocsServiceType]?.allowedPaths;

      // check if path is allowed
      if (!allowedPaths.includes(docsPath))
        throw new BadRequestError('Path not allowed');

      // file path
      const filePath = service ? `${service}/${docsPath}` : docsPath;
      // send the document
      fs.readFile(
        path.join(__dirname, `src/assets/docs/${filePath}.md`),
        (err, data) => {
          if (err) throw err;
          res
            .header('Cache-Control', 'public, max-age=86400') // 1 day
            .status(200)
            .send(data);
        }
      );
    } catch (err) {
      next(err);
    }
  }

  static async getDocsNav(req: Request, res: Response, next: NextFunction) {
    try {
      const { service } = req.params;

      if (service && !docsNav[service as DocsServiceType])
        throw new BadRequestError('Service not found');

      // get the document navigation
      res.json({ nav: docsNav[service as DocsServiceType]?.nav });
    } catch (err) {
      next(err);
    }
  }
}

export default DocsController;
