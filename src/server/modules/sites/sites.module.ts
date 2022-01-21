import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteController } from './sites.controller';
import { SitesService } from './sites.service';
import { Site, SiteSchema } from './schemas/site.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
  ],
  controllers: [SiteController],
  providers: [SitesService],
})
export class SitesModule {}
