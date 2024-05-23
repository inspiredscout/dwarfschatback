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

export class messages{
    @ApiProperty()
    id: string
    @ApiProperty()
    byUserId: string
    @ApiProperty()
    content: string
    @ApiProperty()
    timestamp: Date
    @ApiProperty()
    chatId: string
}

export class users{
    @ApiProperty()
    userIds: string[]

    @ApiProperty()
    id: string
}

export class chatUsers{
    @ApiProperty()
    id: string
    @ApiProperty()
    userid: string
    @ApiProperty()
    chatId: string
}

export class superFullChatDTO extends fullChatDTO{
    @ApiProperty({type: [chatUsers]})
    users: chatUsers[]

    @ApiProperty({type: [messages]})
    messages: messages[]
}

export class chatsDTO extends chatUsers{
    @ApiProperty()
    chat: smallChatDTO
}