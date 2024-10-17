import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teams, TeamsSchema } from './schemas/teams.schema';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Teams.name,
        schema: TeamsSchema
      },
      {
        name: Users.name,
        schema: UsersSchema
      }
    ])
  ]
})
export class TeamsModule {}
