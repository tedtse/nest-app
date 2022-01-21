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
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';

@Controller('api/categories')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor())
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() category: Category) {
    return this.categoriesService.create(category);
  }

  @Get()
  @NoAuth()
  async findAll(@Query('sort') sort): Promise<Category[]> {
    return this.categoriesService.findAll({ sort: JSON.parse(sort ?? '{}') });
  }

  @Get(':id')
  @NoAuth()
  async findById(@Param() { id }): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @Put()
  async findByIdAndUpdate(@Body() category: UpdateQuery<Category>) {
    return this.categoriesService.findByIdAndUpdate(category);
  }

  @Delete(':id')
  async findByIdAndRemove(@Param() { id }) {
    return this.categoriesService.findByIdAndRemove(id);
  }

  @Put('sort')
  async sort(@Body() targets: Category[]) {
    return this.categoriesService.sort(targets);
  }
}
