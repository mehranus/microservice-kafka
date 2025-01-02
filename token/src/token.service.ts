import { HttpStatus, Injectable } from '@nestjs/common';
import { Payload } from './interface/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { Model } from 'mongoose';


@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel:Model<TokenDocument>,
    private readonly jwtService:JwtService
  ){}
   
  async createToken(payload:Payload){
       const token= this.jwtService.sign(payload,{
        expiresIn:60*60*24,
        secret:"secrettoken@11_45"
       })
       const userToken=await this.tokenModel.findOne({userId:payload.userId})
       if(userToken){
        userToken.token=token
        await userToken.save()
       }else{
        await this.tokenModel.create({
          userId:payload.userId,
          token
        })
       }

       return{
        status:HttpStatus.CREATED,
        message:"token created",
        data:{
          token
        }
       }
  }

  async verifyToken(token:string){
    try {

      const verified= this.jwtService.verify(token,{
        secret:"secrettoken@11_45"
      })
    
      if(verified?.userId){
        const existToken=await this.tokenModel.findOne({userId:verified.userId})
        if(!existToken){
          return {
            message:"token is expiered,please try again",
            status:HttpStatus.UNAUTHORIZED,
            error:true
          }
        }
     
        return{
          data:{userId:verified.userId},
          status:HttpStatus.OK,
          error:false
        }
      }

      
    } catch (error) {
      return{
        message:error?.message,
        status:HttpStatus.UNAUTHORIZED,
        error:true
      }
    }
  }

  async destroyToken(userId:string){
    const existToken=await this.tokenModel.findOne({userId})
    if(!existToken){
      return {
        message:"your not login account",
        status:HttpStatus.UNAUTHORIZED,
        error:true
      }
  }
  await this.tokenModel.deleteOne({userId})
  return{
    message:"user destroy saccsessfully",
    status:HttpStatus.OK,
    error:false
  }
}
}
