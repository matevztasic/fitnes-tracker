import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);

        if (existing) {
            throw new BadRequestException('Email already exists');
        }

        const hash = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            passwordHash: hash,
            fullName: dto.fullName,
        });

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return { token };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) throw new UnauthorizedException();

        const valid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!valid) throw new UnauthorizedException();

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return { token };
    }
}