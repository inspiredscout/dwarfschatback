import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserCreateDTO{
    @ApiProperty({ type: 'string', description: 'Никнейм(Уникальный)'})
    username: string

    @ApiProperty({ type: 'string', description: 'Логин(Уникальный)'})
    login: string

    @ApiProperty({ type: 'string', description: 'Пароль'})
    password: string
}

export class fullUserDTO extends UserCreateDTO{
    @ApiProperty({ type: 'string', description: 'ID юзера' })
    id: string;

    @ApiProperty({description: 'Роль юзера'})
    role: string;

    @ApiPropertyOptional({description: 'Рефреш токен'})
    refreshToken: string;

    @ApiProperty({ type: 'string', description: 'Статус юзера' })
    status: string;
    
}

export class pfpDTO{
    @ApiProperty({ type: 'string', format: 'binary', description: 'Фото на аватарку'})
    pfp: any
}

export class changePasswordDTO{
    @ApiProperty({ type: 'string', description: 'Новый пароль'})
    password: string
}

export class changeUsernameDTO{
    @ApiProperty({ type: 'string', description: 'Новый никнейм'})
    username: string
}
export class changeStatusDTO{
    @ApiProperty({ type: 'string', description: 'Новый статус'})
    status: string
}

export class userInfoDTO{
    @ApiProperty({ type: 'string', description: 'ID юзера' })
    id: string;

    @ApiProperty({ type: 'string', description: 'Никнейм' })
    username: string;

    @ApiProperty({ type: 'string', description: 'Статус' })
    status: string;

    @ApiProperty({ type: 'string', description: 'Аватарка' })
    pfp: string;
}