import { ApiProperty } from "@nestjs/swagger";
import { Users } from "src/users/schemas/users.schema";


export class SwaggerAuthResponse{
    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTEwOTRjZjIxZTc3NzRlZjFiYTU3OSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGVzIjpbXSwiaWF0IjoxNzI5MTY5ODMyLCJleHAiOjE3MjkyNTYyMzJ9.gEl_NaBfU-KSKHF__I1V6BJM2TcAIo5nFQvLXxrPkG8', name: 'access_token', type: String, description: 'jwt secret token'})
    access_token: string;
    @ApiProperty({name: 'user', type: Users, description: 'user'})
    user: Users;
}