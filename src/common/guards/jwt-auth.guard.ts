import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard that validates the incoming Bearer token using the `jwt` Passport
 * strategy and populates `request.user` with an
 * {@link AuthenticatedUserEntity}.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
