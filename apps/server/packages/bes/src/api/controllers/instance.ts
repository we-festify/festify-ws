import * as e from 'express';
import { InstanceService } from '@bes/services/instance';
import BESInstance from '@bes/models/bes-instance';

export class InstanceController {
  private readonly instanceService: InstanceService;

  constructor() {
    this.instanceService = new InstanceService(BESInstance);
  }

  public async getInstances(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;

      const instances =
        await this.instanceService.getInstancesByAccount(accountId);

      res.status(200).json({ instances });
    } catch (err) {
      next(err);
    }
  }

  public async getInstanceById(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { id } = req.params;

      const instance = await this.instanceService.getInstanceById(
        id,
        accountId,
      );

      res.status(200).json({ instance });
    } catch (err) {
      next(err);
    }
  }

  public async getInstanceByAlias(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { alias } = req.params;

      const instance = await this.instanceService.getInstanceByAlias(
        alias,
        accountId,
      );

      res.status(200).json({ instance });
    } catch (err) {
      next(err);
    }
  }

  public async createInstance(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const instance = req.body;

      const createdInstance = await this.instanceService.createInstance(
        instance,
        accountId,
      );

      res.status(201).json({ instance: createdInstance });
    } catch (err) {
      next(err);
    }
  }

  public async updateInstance(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { id } = req.params;
      const instance = req.body;

      const updatedInstance = await this.instanceService.updateInstanceById(
        id,
        instance,
        accountId,
      );

      res.status(200).json({ instance: updatedInstance });
    } catch (err) {
      next(err);
    }
  }

  public async deleteInstances(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { ids } = req.body;

      await this.instanceService.deleteOneOrManyInstances(ids, accountId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
