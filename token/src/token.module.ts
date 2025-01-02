import { Module } from "@nestjs/common";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { JwtService } from "@nestjs/jwt";
import { Token, TokenSchema } from "./schema/token.schema";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/microservice-todo'),
    MongooseModule.forFeature([{name:Token.name,schema:TokenSchema}])
  ],
  controllers: [TokenController],
  providers: [TokenService,JwtService],
})
export class TokenModule {}
