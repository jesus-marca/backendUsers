import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from "./dto";
import { AuthGuard } from "./guards/auth.guard";
import { User } from "./entities/user.entity";
import { LoginResponse } from "./interfaces/login-response";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  login(@Body() loginDto: LoginDto) {
    // console.log(loginDto);
    return this.authService.login(loginDto);
  }
  // @UserGuards()
  @Post("/register")
  register(@Body() registerDto: RegisterUserDto) {
    // console.log(registerDto);
    return this.authService.register(registerDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto)
    return this.authService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get("check-token")
  async checkToken(@Request() req: Request): Promise<LoginResponse> {
    const user = req["user"] as User;
    return {
      user,
      token: await this.authService.getJwtToken({ id: user._id }),
    };
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.authService.findUnserById(id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.authService.remove(+id);
  // }
}
