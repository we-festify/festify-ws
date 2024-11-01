import * as e from 'express';
import PermissionPolicy from '@aim/models/permission-policy';
import { PermissionService } from '@aim/services/permission';
import ManagedUser from '@aim/models/managed-user';

export class PermissionController {
  private readonly permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService(
      PermissionPolicy,
      ManagedUser,
    );
  }

  public async getPoliciesByAccountId(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { accountId } = req.user;

      const policies =
        await this.permissionService.getPoliciesByAccountId(accountId);

      res.status(200).json({ policies });
    } catch (err) {
      next(err);
    }
  }

  public async getPolicyById(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { policyId } = req.params;
      const { accountId } = req.user;

      const policy = await this.permissionService.getPolicyById(
        policyId,
        accountId,
      );

      res.status(200).json({ policy });
    } catch (err) {
      next(err);
    }
  }

  public async createPolicy(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { accountId } = req.user;
      const createPolicyDto = req.body;

      await this.permissionService.createPolicy(createPolicyDto, accountId);

      res.status(201).json({ message: 'Policy created successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async updatePolicy(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { policyId } = req.params;
      const { accountId } = req.user;
      const updatePolicyDto = req.body;

      await this.permissionService.updatePolicy(
        policyId,
        updatePolicyDto,
        accountId,
      );

      res.status(200).json({ message: 'Policy updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async deletePolicies(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { accountId } = req.user;
      const { policyIds } = req.body;

      await this.permissionService.deleteOneOrManyPolicies(
        policyIds,
        accountId,
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  public async attachUsersToPolicy(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { policyId } = req.params;
      const { accountId } = req.user;
      const { userIds } = req.body;

      await this.permissionService.attachUsersToPolicy(
        policyId,
        userIds,
        accountId,
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  public async detachUsersFromPolicy(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { policyId } = req.params;
      const { accountId } = req.user;
      const { userIds } = req.body;

      await this.permissionService.detachUsersFromPolicy(
        policyId,
        userIds,
        accountId,
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
