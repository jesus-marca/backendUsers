import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, UnsupportedMediaTypeException } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";

import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload";
import { LoginResponse } from "./interfaces/login-response";
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // const newUser = new this.userModel(createUserDto);
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcrypt.hashSync(password, 10),
        ...userData,
      });

      //encripatar la contrsena

      // guardar el Usuario
      // genrearn jwt
      // console.log(createUserDto);
      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if (error.code === 11000) throw new BadRequestException(`this ${createUserDto.email} already exists!`);
      throw new InternalServerErrorException("Something terrible happens!");
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const userLogin = await this.userModel.findOne({ email: email });

    if (!userLogin) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    // throw new Error("no pasda nada");

    // console.log(password);
    // console.log(userLogin.password);
    // console.log(bcrypt.hashSync(password, 10));
    if (!bcrypt.compareSync(password, userLogin.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }
      
      // throw new Error("el password fallo");
    const { password: _, ...userR } = userLogin.toJSON();
    // return { ...userR, token: "a123" };
    return {
      user: userR,
      token: this.getJwtToken({ id: userLogin.id }),
    };
  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto);
    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUnserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }
  findOne(id: number) {
    return this.userModel.findById(id);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
