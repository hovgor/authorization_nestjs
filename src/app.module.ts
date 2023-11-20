import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { DatabaseConfigService } from './config/config.service.database';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, ConfigModule, UserModule, DatabaseModule],
  providers: [DatabaseConfigService],
})
export class AppModule {}
