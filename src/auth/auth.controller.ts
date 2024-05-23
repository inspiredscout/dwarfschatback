import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { accessTokenDTO, LoginDTO, refreshAccessTokenDTO, tokensDTO } from 'src/models/auth.model';
import { UserService } from 'src/user/user.service';
import { fullUserDTO, UserCreateDTO } from 'src/models/user.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private AuthService:AuthService, private UserService:UserService) {}

    @Post('register')
    @ApiOperation({summary: 'Регистрация пользователя'})
    @ApiOkResponse({type: fullUserDTO, description: 'Информация о зарегестрированном юзере'})
    async createUser(@Body() data: UserCreateDTO){
        if (!data){ throw new BadRequestException}
        return this.UserService.createUser(data)
    }

    @Post('login')
    @ApiOkResponse({type: [tokensDTO], description: "Данные игрока/игроков"})
    async login(@Body() data: LoginDTO) {
    return this.AuthService.validateUser(data);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Обновление Access Токена' })
    @ApiOkResponse({type: [tokensDTO], description: "Данные игрока/игроков"})
    async refreshAccessToken(@Body() data: refreshAccessTokenDTO){
    return this.AuthService.refreshToken(data.refreshToken)
    }
}
