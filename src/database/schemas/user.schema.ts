import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  INVALID_PASSWORD_FORMAT,
  INVALID_PASSWORD_LENGTH,
} from '@shared/constants/strings.constants';

export type UserDocument = HydratedDocument<User>;

@Injectable()
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ unique: true, required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ required: true })
  @Exclude({ toPlainOnly: true })
  @MinLength(8, { message: INVALID_PASSWORD_LENGTH })
  @Matches(/(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*^#?&])/, {
    message: INVALID_PASSWORD_FORMAT,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
