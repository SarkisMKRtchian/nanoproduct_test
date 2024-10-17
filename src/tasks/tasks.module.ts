import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TasksSchema } from './schemas/tasks.schema';
import { TaskChangeHistory, TaskChangeHistorySchema } from './schemas/task-change-history.schema';
import { Teams, TeamsSchema } from 'src/teams/schemas/teams.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Tasks.name,
        schema: TasksSchema
      },
      {
        name: TaskChangeHistory.name,
        schema: TaskChangeHistorySchema
      },
      {
        name: Teams.name,
        schema: TeamsSchema
      },
      {
        name: Users.name,
        schema: UsersSchema
      }
    ]),
    AuthModule
  ]
})
export class TasksModule {}
