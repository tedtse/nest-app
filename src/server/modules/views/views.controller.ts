import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { ViewsService } from './views.service';

@Controller('/')
export class ViewsController {
  constructor(private viewsService: ViewsService) {}

  @Get()
  public async redirectHome(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  // @Get('home')
  // public async goHome(@Req() req: Request, @Res() res: Response) {
  //   await this.viewsService.handler(req, res);
  // }

  @Get('auth/login')
  public async login(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('categories')
  public async goCategories(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('sites')
  public async goSites(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('favicon.ico')
  public async getFavicon(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('logo*')
  public async getLogo(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }
}
