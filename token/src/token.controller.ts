import { Controller, Get } from "@nestjs/common";
import { TokenService } from "./token.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Payloadd } from "./interface/payload.interface";


@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern("create_token_user")
  createToken(@Payload() payload:Payloadd){
    return this.tokenService.createToken(payload)
  }
  @MessagePattern("verify_token")
  verifyToken(@Payload() token:string){
    return this.tokenService.verifyToken(token)
  }
  @MessagePattern("destroy_token")
  destroyToken(@Payload() {userId}:{userId:string}){
    return this.tokenService.destroyToken(userId)
  }

}
