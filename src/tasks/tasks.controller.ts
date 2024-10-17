import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserDecorator } from 'src/users/decorators/users.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Tasks } from './schemas/tasks.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/sort-tasks.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/users/schemas/users.schema';

@ApiTags('Tasks')
@UseGuards(AuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  
  @ApiOperation({ summary: 'Create task' })
  @ApiOkResponse({ description: 'Task created', type: Tasks })
  @Post('/create')
  public createTask(@Body() dto: CreateTaskDto, @User() user: UserDecorator) {
    return this.tasksService.create(dto, user);
  }

  @ApiOperation({ summary: 'Get current user tasks' })
  @ApiOkResponse({ description: 'Current user tasks', type: [Tasks] })
  @Post()
  public getCurrentUserTasks(@Body() dto: GetTasksDto, @User() user: UserDecorator) {
    return this.tasksService.getCurrentUserTasks(dto, user);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiOkResponse({ description: 'All tasks', type: [Tasks] })
  @Roles(RolesEnum.ADMIN)
  @Post('/all')
  public getAll(@Body() dto: GetTasksDto) {
    return this.tasksService.getAll(dto);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({ description: 'Task updated', type: Tasks })
  @Put('/update')
  public updateTask(@Body() dto: UpdateTaskDto, @User() user: UserDecorator) {
    return this.tasksService.update(dto, user)
  }
}
