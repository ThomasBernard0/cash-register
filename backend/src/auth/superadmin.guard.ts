import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const account = request.user;

    if (!request?.isSuperAdmin) {
      throw new ForbiddenException('Only superadmin can perform this action');
    }

    return true;
  }
}
