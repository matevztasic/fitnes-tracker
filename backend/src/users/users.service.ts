import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: {
        email: string;
        passwordHash: string;
        fullName: string;
    }): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }
}