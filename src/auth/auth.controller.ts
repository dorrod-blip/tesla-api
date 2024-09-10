import { AuthsService } from './auth.service';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthsService) {}

  @Get('/') 
  login(@Res() res) {
    res.redirect(this.authService.getQueryParams());
  }

  @Get('/callback') 
  async callback(@Req() req) {
    try {
      const data = await this.authService.requestAuthorize(req.query.code);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('/profile')
  // @UseGuards(JwtAuthGuard)
  async profile(@Req() req) {
    try {
      return this.authService.getProfile(req.query.access_token);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
