import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { IFindId, ILogin, ISignup } from "./interface/user.interface";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern("signup")
  signup(@Payload() signupDto:ISignup){
    return this.userService.signup(signupDto)
  }

  @MessagePattern("login")
  login(@Payload() loginDto:ILogin){
    return this.userService.login(loginDto)
  }

  @MessagePattern("get_user_by_id")
  findUserById(@Payload() {userId}:{userId:string}){
    return this.userService.findUserById(userId)
  }
 
}
