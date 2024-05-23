import { ApiProperty } from "@nestjs/swagger";

export class refreshAccessTokenDTO{
    @ApiProperty({ type: 'string', description: 'Рефреш токен' })
    refreshToken: string;
}

export class accessTokenDTO{
    @ApiProperty({ type: 'string', description: 'токен' })
    access_token: string;
}

export class discordTokenDTO{
    @ApiProperty({type: 'string', description: 'токен'})
    discord_token: string;
}

export class tokensDTO{
    @ApiProperty({ type: 'string', description: 'токен' })
    access_token: string;
    
    @ApiProperty({ type: 'string', description: 'Рефреш токен' })
    refresh_token: string;
}

export class LoginDTO{
    @ApiProperty({description: 'Логин'})
    login: string;

    @ApiProperty({description: 'Пароль'})
    password: string;
}