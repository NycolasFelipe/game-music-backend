import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedUserEntity } from "@/common/entities/authenticated-user.entity";

/** Shape of the signed JWT payload. */
interface JwtPayload {
  sub: string;
  username: string;
}

/**
 * Passport JWT strategy. Extracts the Bearer token, verifies its signature and
 * expiry, and maps the payload to an {@link AuthenticatedUserEntity}.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET", "change-me-in-production"),
    });
  }

  /**
   * Builds the authenticated actor from a verified JWT payload. Passport
   * attaches the returned value to `request.user`.
   *
   * @param payload - The decoded, signature-verified JWT payload.
   * @returns The authenticated user.
   */
  validate(payload: JwtPayload): AuthenticatedUserEntity {
    return new AuthenticatedUserEntity(payload.sub, payload.username);
  }
}
