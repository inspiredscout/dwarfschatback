import { BadRequestException, Body, Controller, Get, Header, Put, Query, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { changePasswordDTO, changeStatusDTO, changeUsernameDTO, fullUserDTO, pfpDTO, userInfoDTO } from 'src/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение информации о юзере по токену' })
    @ApiOkResponse({type: [fullUserDTO], description: "Данные игрока/игроков"})
    async getInfo(@Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.UserService.getInfo(token)
    }

    @Put('pfp')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение аватарки' })
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    async changePfp(@UploadedFile() file, @Body() data: pfpDTO, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        data.pfp = file
        return this.UserService.changePfp(data, token)
    }

    @Put('password')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение пароля' })
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    async changePassword(@Body() data: changePasswordDTO, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.UserService.changePassword(data, token)
    }

    @Put('username')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение никнейма' })
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    async changeUsername(@Body() data: changeUsernameDTO, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.UserService.changeUsername(data, token)
    }

    @Put('status')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение статуса' })
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    async changeStatus(@Body() data: changeStatusDTO, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.UserService.changeStatus(data, token)
    }

    @Get()
    @ApiOperation({summary: 'Поиск юзера по нику'})
    @ApiOkResponse({type: [userInfoDTO], description: 'Информация о юзере'})
    async findUser(@Query('username') username:string){
        return this.UserService.findUserByUsername(username)
    }

}
