import { Body, Controller, Get, HttpException, HttpStatus, Inject, InternalServerErrorException, OnModuleInit, Post, Req } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginDto, SignUpDto } from './dto/user.dto';
import { catchError, lastValueFrom } from 'rxjs';
import { Auth } from './decorator/auth.decorator';
import { Request } from 'express';
import { ResposeType } from './types/respons.type';


@Controller('user')
@ApiTags("User")
export class UserController implements OnModuleInit {
  constructor(
    @Inject("USER_SERVICE") private readonly  userClinetService:ClientKafka,
    @Inject("TOKEN_SERVICE") private readonly  tokenClinetService:ClientKafka,
  ) {}

  async onModuleInit() {
    this.userClinetService.subscribeToResponseOf('signup')
    this.userClinetService.subscribeToResponseOf('login')
    this.tokenClinetService.subscribeToResponseOf('destroy_token')
    this.tokenClinetService.subscribeToResponseOf('create_token_user')
    await Promise.all([
      this.tokenClinetService.connect(),
      this.userClinetService.connect(),
    ])
    
  }

  @Post('signup')
  @ApiConsumes('application/x-www-form-urlencoded')
   async signup(@Body() signupDto:SignUpDto){
    const respons:ResposeType=await new Promise((resolve,reject)=>{
      this.userClinetService.send("signup",signupDto).subscribe((data)=>resolve(data))
   })
    if(respons?.error){
      throw new HttpException(respons?.message,respons?.status ?? 500)
    }
    if(respons?.data){
      const responsToken:ResposeType=await new Promise((resolve,reject)=>{
        this.tokenClinetService.send("create_token_user",{userId:respons?.data?.userId,email:respons?.data?.email}).subscribe((data)=>resolve(data))
    })
      if(responsToken?.data?.token){
        return{
          token:responsToken?.data?.token
        }
      }
    }
     throw new InternalServerErrorException("some service in missing")
  }
  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
   async login(@Body() loginDto:LoginDto){
    const respons:ResposeType=await new Promise( (resolve,reject)=>{
      this.userClinetService.send("login",loginDto).subscribe((data)=>resolve(data))
    } )
    if(respons?.error){
      throw new HttpException(respons?.message,respons?.status ?? 500)
    }
    if(respons?.data){
      const responsToken:ResposeType=await new Promise( (resolve,reject)=>{
        this.tokenClinetService.send("create_token_user",{userId:respons?.data?.userId,email:respons?.data?.email}).subscribe((data)=>resolve(data))
    })
      if(responsToken?.data?.token){
        return{
          token:responsToken?.data?.token
        }
      }
    }
     throw new InternalServerErrorException("some service in missing")
  }


  @Get("check_login")
  @Auth()
  getUser(@Req() req:Request){
    return req?.user
  }
  @Get("logout")
  @Auth()
  async logoutUser(@Req() req:Request){
   const {_id}=req?.user
   const response:ResposeType=await new Promise( (resolve,reject)=>{
    this.tokenClinetService.send("destroy_token",{userId:_id}).subscribe((data)=>resolve(data))
   } )

   if(response?.error){
    throw new HttpException(response?.message,response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
   }
   return{
    message:response?.message,
    status:response?.status
   }

  }

}
