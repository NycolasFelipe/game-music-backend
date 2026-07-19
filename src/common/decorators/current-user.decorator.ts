import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedUserEntity } from "../entities/authenticated-user.entity";

/**
 * Parameter decorator that returns the authenticated user attached to the
 * request by {@link JwtAuthGuard}.
 *
 * @returns The current {@link AuthenticatedUserEntity}.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUserEntity => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: AuthenticatedUserEntity }>();
    return request.user;
  },
);
