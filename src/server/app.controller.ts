import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
// import { AppService } from './app.service';
import nextServer from './next.app';

const handle = nextServer.getRequestHandler();

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  async goHomePage(@Req() req: Request, @Res() res: Response) {
    await nextServer.render(req, res, '/home');
  }

  @Get('user/login')
  async goLoginPage(@Req() req: Request, @Res() res: Response) {
    await nextServer.render(req, res, '/user/login');
  }

  @Get('/categories')
  async goCategoresPage(@Req() req: Request, @Res() res: Response) {
    await nextServer.render(req, res, '/categories');
  }

  @Get('_next/*')
  handle(@Req() req: Request, @Res() res: Response) {
    return handle(req, res);
  }
}
