import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { hashPassword, comparePassword } from '../common/auth.utils';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // 检查用户名或邮箱是否已存在
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { username: dto.username }],
            },
        });

        if (existingUser) {
            throw new ConflictException('用户名或邮箱已存在');
        }

        // 加密密码
        const hashedPassword = await hashPassword(dto.password);

        // 创建用户
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.username,
                password: hashedPassword,
                nickname: dto.nickname,
                role: 'user',
            },
        });

        // 返回 token
        return this.generateToken(user);
    }

    async login(dto: LoginDto) {
        // 查找用户
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });

        if (!user) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        // 验证密码
        const isPasswordValid = await comparePassword(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        // 返回 token
        return this.generateToken(user);
    }

    private generateToken(user: { id: number; username: string; role: string }) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        };
    }

    async validateUser(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                nickname: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
        });
    }
}
