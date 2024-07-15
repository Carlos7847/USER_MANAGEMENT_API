import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async findAll(page: number, count: number): Promise<Users[]> {
    return this.userRepository.find({
      skip: (page - 1) * count,
      take: count,
    });
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(
        `El usuario con ID ${id} no ha sido encontrado`,
      );
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { usuario, email, contraseña } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ usuario }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      contraseña: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        `El usuario con ID ${id} no ha sido encontrado`,
      );
    }

    if (updateUserDto.contraseña) {
      updateUserDto.contraseña = await bcrypt.hash(
        updateUserDto.contraseña,
        10,
      );
    }

    Object.assign(user, updateUserDto);
    const usuarioGuardado = await this.userRepository.save(user);

    return { ...usuarioGuardado, contraseña: '******' };
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `No se ha encontrado un usuario con el ID: ${id}`,
      );
    }
  }

  async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: [{ usuario: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new NotFoundException(
        `No se ha encontrado un usuario con la información brindada: ${usernameOrEmail}`,
      );
    }
    return user;
  }
}
