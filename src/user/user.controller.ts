import { BadRequestException, Body, Controller, Get, Post, Req} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { fullUserDTO, UserCreateDTO } from 'src/models/user.model';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private UserService:UserService){}

    // @Post('')
    // @ApiOperation({summary: 'Регистрация пользователя'})
    // @ApiOkResponse({type: fullUserDTO, description: 'Информация о зарегестрированном юзере'})
    // async createUser(@Body() data: UserCreateDTO){
    //     if (!data){ throw new BadRequestException}
    //     return this.UserService.createUser(data)
    // }

    @Get('userInfo')
    @ApiOperation({ summary: 'Получение информации о юзере по токену' })
    @ApiOkResponse({type: [fullUserDTO], description: "Данные игрока/игроков"})
    async getInfo(@Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.UserService.getInfo(token)
    }

}
