import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from './dto/create-team.dto';
import { User, UserDecorator } from 'src/users/decorators/users.decorator';
import { Teams } from './schemas/teams.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/users/schemas/users.schema';

@UseGuards(AuthGuard, RolesGuard)
@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ summary: 'Create team' })
  @ApiOkResponse({ description: 'Team created', type: Teams })
  @Post('/create')
  public async createTeam(@Body() dto: CreateTeamDto, @User() user: UserDecorator) {
    return await this.teamsService.create(dto, user);
  }

  @ApiOperation({ summary: 'Get current user teams' })
  @ApiOkResponse({ description: 'Current user teams', type: [Teams] })
  @Get()
  public getCurrentUserTeams(@User() user: UserDecorator){
    return this.teamsService.getCurrentUserTeams(user);
  }

  @ApiOperation({ summary: 'Get all teams' })
  @ApiOkResponse({ description: 'All teams', type: [Teams] })
  @Roles(RolesEnum.ADMIN)
  @Get("/all")
  public getAllTeams() {
    return this.teamsService.getAll();
  }

  @ApiOperation({ summary: 'Get team by id' })
  @ApiParam({ name: 'id', description: 'Team id' })
  @ApiOkResponse({ description: 'Team', type: Teams })
  @Get('/id/:id')
  public getTeamById(@Param('id') id: string, @User() user: UserDecorator) {
    return this.teamsService.getById(id, user);
  }

  @ApiOperation({ summary: 'Add member to team' })
  @ApiParam({ name: 'id', description: 'Team id' })
  @ApiBody({ schema: {example: { member: 'user_id'}} })
  @ApiOkResponse({ description: 'Team', type: Teams })
  @Roles(RolesEnum.ADMIN)
  @Patch('/add-member/:id')
  public addMember(@Param('id') id: string, @Body('member') member: string) {
    return this.teamsService.addMember(id, member);
  }

  @ApiOperation({ summary: 'Rename team' })
  @ApiParam({ name: 'id', description: 'Team id' })
  @ApiBody({ schema: {example: { name: 'new name'}} })
  @ApiOkResponse({ description: 'Team', type: Teams })
  @Patch('/rename/:id')
  public renameTeam(@Param('id') id: string, @Body('name') name: string) {
    return this.teamsService.rename(id, name);
  }

  @ApiOperation({ summary: 'Set responsible for team' })
  @ApiOkResponse({ description: 'Team', type: Teams })
  @ApiParam({ name: 'id', description: 'Team id' })
  @ApiBody({ schema: {example: { responsible: 'user_id'}} })
  @Roles(RolesEnum.ADMIN)
  @Patch('/set-responsible/:id')
  public setResponsible(@Param('id') id: string, @Body('responsible') responsible: string) {
    return this.teamsService.setResponsible(id, responsible);
  }

  @ApiOperation({ summary: 'Remove member from team' })
  @ApiOkResponse({ description: 'Team', type: Teams })
  @ApiParam({ name: 'id', description: 'Team id' })
  @ApiBody({ schema: {example: { member: 'user_id'}} })
  @Roles(RolesEnum.ADMIN)
  @Delete('/remove-member/:id')
  public removeMember(@Param('id') id: string, @Body('member') member: string) {
    return this.teamsService.removeMember(id, member);
  }

  @ApiOperation({ summary: 'Delete team' })
  @ApiParam({ name: 'id', description: 'Team id' })
  @ApiOkResponse({ description: 'Team deleted', type: Teams })
  @Roles(RolesEnum.ADMIN)
  @Delete('/delete/:id')
  public deleteTeam(@Param('id') id: string) {
    return this.teamsService.delete(id);
  }


}
