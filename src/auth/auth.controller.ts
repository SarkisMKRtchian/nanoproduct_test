import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerAuthResponse } from './swagger-schemas/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: 'Login', description: 'Login to the system'})
  @ApiOkResponse({description: 'User logged in successfully', type: SwaggerAuthResponse})
  @Post('login')
  public async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({summary: 'Register', description: 'Register to the system. **ВЫДАЧА РОЛЕЙ ДЛЯ ТЕСТОВ!!'})
  @ApiOkResponse({description: 'User registered successfully', type: SwaggerAuthResponse})
  @Post('register')
  public async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
