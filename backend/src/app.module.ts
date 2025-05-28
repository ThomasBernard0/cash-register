import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AccountModule } from './account/account.module';
import { SectionModule } from './section/section.module';
import { SessionModule } from './session/session.module';
import { CommandModule } from './command/command.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*'],
    }),
    AuthModule,
    PrismaModule,
    AccountModule,
    SectionModule,
    SessionModule,
    CommandModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
