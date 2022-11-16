import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test } from '@entities/Test.entity';
import { User } from '@entities/User.entity';
import { WorkHistory } from '@entities/WorkHistory.entity';
import { Education } from '@entities/Education.entity';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { TestModule } from '@/modules/test/test.module';
import { UserModule } from '@/modules/user/user.module';
import { filePath } from '@/modules/file/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Test, User, WorkHistory, Education],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: filePath,
    }),
    AuthModule,
    TestModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
