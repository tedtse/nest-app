import { Controller, Get, Res, Req, Redirect } from '@nestjs/common';
import { Request, Response } from 'express';

import { ViewsService } from './views.service';

@Controller('/')
export class ViewsController {
  constructor(private viewsService: ViewsService) {}

  @Get()
  @Redirect('/home', 301)
  public async redirectHome(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('home')
  public async goHome(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('/categories')
  public async goCategories(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }

  @Get('favicon.ico')
  public async favicon(@Req() req: Request, @Res() res: Response) {
    await this.viewsService.handler(req, res);
  }
}
