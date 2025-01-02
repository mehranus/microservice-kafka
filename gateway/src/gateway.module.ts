import { Module } from '@nestjs/common';
import {  UserController } from './user.controller';
import { GatewayService } from './gateway.service';
import { ClientProxyFactory, ClientsModule, RmqOptions, Transport } from '@nestjs/microservices';
import { TaskController } from './task.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:"USER_SERVICE",
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:"user",
            brokers:['localhost:29092']
          },
          consumer:{
            groupId:'user-consumer'
          }
        }
      },
      {
        name:"TOKEN_SERVICE",
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:"token",
            brokers:['localhost:29092']
          },
          consumer:{
            groupId:'token-consumer'
          }
        }
      },
      {
        name:"TASK_SERVICE",
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:"task",
            brokers:['localhost:29092']
          },
          consumer:{
            groupId:'task-consumer'
          }
        }
      }
    ])
  ],
  controllers: [UserController,TaskController],
  providers: [GatewayService],
})
export class GatewayModule {}
