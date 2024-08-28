import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  //respetar el orden,conectar las variables de entorno primero
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME }), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor(){
  //   console.log('mi variable',process.env)
  // }
}
