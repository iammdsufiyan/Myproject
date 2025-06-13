 import { Exclude } from 'class-transformer';
import { IsString, IsNotEmpty, Matches } from 'class-validator';
export class PostDto {

     @IsString()
  @IsNotEmpty()
   @Matches(/\S/, { message: 'location should not be just spaces' })
    location: string;


 @IsString()
  @IsNotEmpty()
   @Matches(/\S/, { message: 'title should not be just spaces' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'content should not be just spaces' })
  content: string;

 
  
}