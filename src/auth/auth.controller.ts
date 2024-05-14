import { BadRequestException, Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { accessTokenDTO, LoginDTO, refreshAccessTokenDTO } from 'src/models/auth.model';
import { UserService } from 'src/user/user.service';
import { fullUserDTO, UserCreateDTO } from 'src/models/user.model';
// import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
// import { LocalStrategy } from './local.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private AuthService:AuthService, private UserService:UserService) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('data.php'))
    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiOkResponse({type: fullUserDTO, description: 'Информация о зарегестрированном юзере'})
    async createUser(@Body() data: UserCreateDTO){
        if (!data){ throw new BadRequestException}
        return this.UserService.createUser(data)
    }

    @Post('login')
    async login(@Body() data: LoginDTO) {
    return this.AuthService.validateUser(data);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Обновление Access Токена' })
    @ApiOkResponse({type: [accessTokenDTO], description: "Данные игрока/игроков"})
    async refreshAccessToken(@Body() data: refreshAccessTokenDTO){
    return this.AuthService.refreshToken(data.refreshToken)
    }
}
