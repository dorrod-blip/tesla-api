import { Body, Controller, Get, Post, Req, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
// @UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('vins/all')
  async getVins(@Req() req) {
    const vins: any = await this.dashboardService.getVins(req);
    console.log('vins: ', vins);
    return vins;
  }

  @Get('vehicle')
  async getVehicle (@Req() req) {
    if (!req.query.id) {
      return;
    }
    try {
      const vehicle: any = await this.dashboardService.getVehicle(req);
      return vehicle;
    } catch(error) {
        console.log('vehicle error: ', error);
      return error;
    }
  }

  @Get('lock')
  async setLock(@Req() req) {
    try {
      const data: any = await this.dashboardService.setLock(req);
      return data;
    } catch(error) {
        console.log('lock error: ', error);
      return error;
    }
  }

  @Get('unlock')
  async setUnlock(@Req() req) {
    try {
      const data: any = await this.dashboardService.setUnlock(req);
      return data;
    } catch(error) {
        console.log('unlock error', error);
      return error;
    }
  }
}
