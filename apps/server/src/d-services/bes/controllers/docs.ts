import { Request, Response, NextFunction } from 'express';

// data
import { allowedPaths, docsNav, PathType } from '../utils/docs';
import { BadRequestError } from '../../../utils/errors';

// utils
import fs from 'fs';
import path from 'path';

class DocsController {
  static async getDocs(req: Request, res: Response, next: NextFunction) {
    try {
      let { path: docsPath } = req.query;
      if (!docsPath) throw new BadRequestError('Path is required');

      // sanitize path
      docsPath = docsPath.toString().trim();

      // check if path is allowed
      if (!allowedPaths.includes(docsPath as PathType))
        throw new BadRequestError('Path not allowed');

      // send the document
      fs.readFile(
        path.join(__dirname, `src/assets/docs/bes/${docsPath}.md`),
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
      // get the document navigation
      res.json({ nav: docsNav });
    } catch (err) {
      next(err);
    }
  }
}

export default DocsController;
