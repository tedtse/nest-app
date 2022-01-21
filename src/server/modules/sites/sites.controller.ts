import {
  Body,
  Param,
  Query,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UpdateQuery } from 'mongoose';
import { AuthGuard, NoAuth } from '@server/guards/auth.guard';
import { HttpExceptionFilter } from '@server/filters/http-exception.filter';
import { ResponseInterceptor } from '@server/interceptors/transform-interceptor';
import { SitesService } from './sites.service';
import { Site } from './schemas/site.schema';

@Controller('api/sites')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor())
export class SiteController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  async create(@Body() site: Site) {
    return this.sitesService.create(site);
  }

  @Get()
  @NoAuth()
  async findSites(@Query() query): Promise<Site[]> {
    const { options, ...filters } = query;
    return this.sitesService.findAll({
      ...filters,
      options: JSON.parse(options),
    });
  }

  @Get(':id')
  @NoAuth()
  async findById(@Param() { id }): Promise<Site> {
    return this.sitesService.findById(id);
  }

  @Put()
  async findByIdAndUpdate(@Body() site: UpdateQuery<Site>) {
    return this.sitesService.findByIdAndUpdate(site);
  }

  @Delete(':id')
  async findByIdAndRemove(@Param() { id }) {
    return this.sitesService.findByIdAndRemove(id);
  }

  @Put('sort')
  async sort(
    @Body() { categoryId, targets }: { categoryId: string; targets: Site[] },
  ) {
    return this.sitesService.sort(categoryId, targets);
  }
}
