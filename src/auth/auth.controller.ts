import { AuthsService } from './auth.service';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthsService) {}

  @Get('/tesla') 
  login(@Res() res) {
    console.log("hello");
    res.redirect(this.authService.getQueryParams());
  }

  @Get('/callback') 
  async callback(@Req() req) {
    try {
      const data = await this.authService.requestAuthorize(req.query.code);
      return data;
    } catch (error) {
    //   console.log(error);
      return error;
    }
  }

  @Get('/register')
  // @UseGuards(JwtAuthGuard)
  async register(@Req() req) {
    try {
      const data = await this.authService.getPartnerToken();
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
