import { IsString, IsNotEmpty , Matches } from 'class-validator';
export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'location should not be just spaces' })
  location: string;

@IsString()
@IsNotEmpty()
@Matches(/\S/, { message: 'content should not be just spaces' })
name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'email should not be just spaces' })
  email: string;

 

} 