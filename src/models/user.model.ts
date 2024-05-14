import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserCreateDTO{
    @ApiProperty({ type: 'string', description: 'Никнейм(Уникальный)'})
    username: string

    @ApiProperty({ type: 'string', description: 'Логин(Уникальный)'})
    login: string

    @ApiProperty({ type: 'string', description: 'Пароль'})
    password: string

    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Фото на аватарку'})
    pfpId: any
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