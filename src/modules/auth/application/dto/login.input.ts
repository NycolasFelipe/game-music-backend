/**
 * Application-layer input for the login use case. Plain class with no
 * transport/validation decorators — the controller validates and maps the HTTP
 * DTO into this shape before delegating.
 */
export class LoginInput {
  username: string;
  password: string;
}
