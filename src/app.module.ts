import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({envFilePath: '.env'}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    UsersModule,
    TeamsModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
