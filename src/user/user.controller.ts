import { BadRequestException, Body, Controller, Get, Header, Put, Query, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { changePasswordDTO, changeStatusDTO, changeUsernameDTO, fullUserDTO, pfpDTO, superFullUserDTO, userInfoDTO } from 'src/models/user.model';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private UserService:UserService){}

    @Get('userInfo')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение информации о юзере по токену' })
    @ApiOkResponse({type: [superFullUserDTO], description: "Данные игрока/игроков"})
    async getInfo(@Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.UserService.getInfo(token)
    }

    @Put('pfp')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Изменение аватарки' })
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    @UseInterceptors(FileInterceptor('pfp'))
    @ApiConsumes('multipart/form-data')
    async changePfp(@UploadedFile() pfp, @Body() data: pfpDTO, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        data.pfp = pfp
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

    @Get('id')
    @ApiOperation({summary: 'Поиск юзера по айдишнику'})
    @ApiOkResponse({type: [userInfoDTO], description: 'Информация о юзере'})
    async findUserId(@Query('id') id:string){
        return this.UserService.findUserByIdv2(id)
    }

}
