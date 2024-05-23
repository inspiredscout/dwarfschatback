import { ApiProperty } from "@nestjs/swagger";

export class chatDTO{
    @ApiProperty()
    name: string

    @ApiProperty()
    userIds: string[]

}

export class fullChatDTO extends chatDTO{
    
    @ApiProperty()
    id: string

    @ApiProperty()
    PrivKey: string

    @ApiProperty()
    PubKey: string
}

export class users{
    @ApiProperty()
    userIds: string[]

    @ApiProperty()
    id: string
}

export class superFullChatDTO extends fullChatDTO{
    @ApiProperty()
    users: string[]

    @ApiProperty()
    messages: string[]
}