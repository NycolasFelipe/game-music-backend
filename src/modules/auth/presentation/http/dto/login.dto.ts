import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * HTTP request body for `POST /auth/login`. Validated by the global
 * ValidationPipe before reaching the controller.
 */
export class LoginDto {
  @ApiProperty({ example: "user", description: "The user's username" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "user", description: "The user's password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
