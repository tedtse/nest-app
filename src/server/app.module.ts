import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SitesModule } from './modules/sites/sites.module';
import { FilesModule } from './modules/files/files.module';
import { AuthModule } from './modules/auth/auth.module';
import { ViewsModule } from './modules/views/views.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/navigator'),
    ViewsModule,
    UsersModule,
    CategoriesModule,
    SitesModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
