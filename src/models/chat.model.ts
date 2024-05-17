import { ApiProperty } from "@nestjs/swagger";

export class chatDTO{
    @ApiProperty()
    name: string

    @ApiProperty()
    userIds: string[]
}