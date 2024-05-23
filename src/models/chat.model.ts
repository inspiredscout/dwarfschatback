import { ApiProperty } from "@nestjs/swagger";

export class chatDTO{
    @ApiProperty()
    name: string

    @ApiProperty()
    userIds: string[]

}

export class smallChatDTO{
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string
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

export class chatsDTO{
    @ApiProperty()
    id: string
    @ApiProperty()
    userId: string
    @ApiProperty()
    chatId: string
    @ApiProperty()
    chat: smallChatDTO
}