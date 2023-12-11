import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { DatabaseConfigService } from './config/config.service.database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    AuthModule,
    ConfigModule,
    UserModule,
  ],
  providers: [DatabaseConfigService],
})
export class AppModule {}
