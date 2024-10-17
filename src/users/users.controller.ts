import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserDecorator } from './decorators/users.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesEnum, Users } from './schemas/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('User')
@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}


  @ApiOperation({ summary: 'Get current user'})
  @ApiOkResponse({ type: Users })
  @Get()
  public getMe(@User() user: UserDecorator){
    return this.userService.getById(user.id); 
  }

  @ApiOperation({ summary: 'Get user by id'})
  @ApiOkResponse({ type: Users })
  @Roles(RolesEnum.ADMIN)
  @Get('/one/:id')
  public getOne(@Param('id') id: string){
    return this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Get all users'})
  @ApiOkResponse({ type: [Users] })
  @Roles(RolesEnum.ADMIN)
  @Get('/all')
  public getAll(){
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Update current user'})
  @ApiOkResponse({ type: Users })
  @Patch('/update')
  public update(@Body() dto: UpdateUserDto, @User() user: UserDecorator){
    return this.userService.update(dto, user)
  }

  @ApiOperation({ summary: 'Update user roles'})
  @ApiOkResponse({ type: Users })
  @Roles(RolesEnum.ADMIN)
  @Patch('/update/roles')
  public updateRoles(@Body() dto: UpdateRolesDto){
    return this.userService.updateRoles(dto)
  }

  @ApiOperation({ summary: 'Delete user'})
  @ApiOkResponse({ type: Users })
  @Delete('/delete/:id')
  @Roles(RolesEnum.ADMIN)
  public delete(@Param('id') id: string){
    return this.userService.removeUser(id)
  }
}
