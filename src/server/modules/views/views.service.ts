import { Injectable, OnModuleInit } from '@nestjs/common';

import createServer from 'next';
import { NextServer } from 'next/dist/server/next';
import { Request, Response } from 'express';

@Injectable()
export class ViewsService implements OnModuleInit {
  private server: NextServer;

  async onModuleInit(): Promise<void> {
    const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
    try {
      this.server = createServer({
        dev: IS_DEVELOPMENT,
        dir: './src/client',
      });
      await this.server.prepare();
    } catch (error) {
      console.error(error);
    }
  }

  handler(req: Request, res: Response) {
    return this.server.getRequestHandler()(req, res);
  }
}
