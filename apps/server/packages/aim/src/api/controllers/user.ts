import * as e from 'express';
import ManagedUser from '@aim/models/managed-user';
import { ManagedUserService } from '@aim/services/user';
import PermissionPolicy from '@aim/models/permission-policy';

export class UserController {
  private readonly managedUserService: ManagedUserService;

  constructor() {
    this.managedUserService = new ManagedUserService(
      ManagedUser,
      PermissionPolicy,
    );
  }

  public async getUsers(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { policy } = req.query;
      const accountId = req.user.accountId;

      let users = [];

      if (policy) {
        users = await this.managedUserService.getUsersAttachedToPolicy(
          policy as string,
          accountId,
        );
      } else {
        users = await this.managedUserService.getUsersByAccountId(accountId);
      }

      res.status(200).json({ users });
    } catch (err) {
      next(err);
    }
  }

  public async getUserById(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const user = await this.managedUserService.getUserById(userId);
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async createUser(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user.accountId;
      const createUserDto = req.body;
      const user = await this.managedUserService.createUser(createUserDto, {
        accountId,
      });
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async updateUser(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user.accountId;
      const userId = req.params.userId;
      const updateUserDto = req.body;
      const user = await this.managedUserService.updateUser(
        userId,
        updateUserDto,
        { accountId },
      );
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async deleteUsers(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.user.accountId;
      const userIds = req.body.userIds;
      await this.managedUserService.deleteOneOrManyUsers(userIds, accountId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async attachPoliciesToUser(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { accountId } = req.user;
      const { policyIds } = req.body;

      await this.managedUserService.attachPoliciesToUser(
        userId,
        policyIds,
        accountId,
      );

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async detachPoliciesFromUser(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { accountId } = req.user;
      const { policyIds } = req.body;

      await this.managedUserService.detachPoliciesFromUser(
        userId,
        policyIds,
        accountId,
      );

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
