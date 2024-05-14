import { BadRequestException, Body, Controller, Post} from '@nestjs/common';
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

}
