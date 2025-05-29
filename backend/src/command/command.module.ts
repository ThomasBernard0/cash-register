import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [CommandService],
  controllers: [CommandController],
  exports: [CommandService],
})
export class CommandModule {}
