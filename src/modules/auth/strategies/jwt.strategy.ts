import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('auth.jwt.secret'),
      passReqToCallback: true,
    });
  }

  /**
   * NOTE: `req` is available here and can be used to extract the raw JWT.
   *
   * This can support enforcing a single active session per user:
   * - Compare the JWT in the request with the token stored in the user document.
   * - Reject the request if they don't match (i.e., user is logged in elsewhere).
   *
   * Implementation details:
   * - Store or update the token in the user document during login and token refresh.
   * - This logic should be implemented in the
   * `login()` (needs to be implemented as login currently stops at the controller level and no it's not wrong)
   *  and `refresh()` methods of the `AuthService` class.
   */
  async validate(req: Request, payload: any) {
    const user = await this.usersService.findOne(
      {
        id: payload.sub,
      },
      { failHandler: () => new NotFoundException('User not found') },
    );
    return user;
  }
}
