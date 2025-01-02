import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { HttpArgumentsHost, OnModuleInit } from "@nestjs/common/interfaces";
import { ClientKafka } from "@nestjs/microservices";
import { Request } from "express";
import { ResposeType } from "src/types/respons.type";


@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(
    @Inject("USER_SERVICE") private readonly userClinetService: ClientKafka,
    @Inject("TOKEN_SERVICE") private readonly tokenClinetService: ClientKafka
  ) {}
  async onModuleInit() {
    this.tokenClinetService.subscribeToResponseOf("verify_token")
    this.userClinetService.subscribeToResponseOf("get_user_by_id")
    await Promise.all([
      this.tokenClinetService.connect(),
      this.userClinetService.connect()
    ])
  }

 async canActivate(context: ExecutionContext) {
    const httpContext:HttpArgumentsHost=context.switchToHttp()
    const req:Request=httpContext.getRequest()
    const {authorization = undefined}=req.headers

    if(!authorization) throw new UnauthorizedException("authorization headers is requierd")
    const [bearer,token]=authorization?.split(' ') 
   if(!bearer || bearer.toLowerCase() !== "bearer")  throw new UnauthorizedException("bearer token is incorent")
   if(!token)  throw new UnauthorizedException("token is requierd!")
   const verifyUserRespons:ResposeType=await new Promise((resolve,reject)=>{
  this.tokenClinetService.send('verify_token',token).subscribe((data)=>resolve(data))
 }) 
  if(verifyUserRespons?.error || !verifyUserRespons){
   
     throw new HttpException(verifyUserRespons?.message,verifyUserRespons?.status)
    
  }

  const {data}=verifyUserRespons

  if(!data || !data?.userId) throw new UnauthorizedException("user account not found!")
  const userRespouns: any=await new Promise((resolve,reject)=>{
  this.userClinetService.send("get_user_by_id",{userId:data?.userId}).subscribe((data)=>resolve(data))
 })  

  if(userRespouns?.error || !userRespouns){
    throw new HttpException(userRespouns?.message,userRespouns?.status)
  }
  const {user = undefined}=userRespouns?.data

  if(!user) throw new UnauthorizedException("user account not found!")
   
    req.user=user


    return true;
  }
}
