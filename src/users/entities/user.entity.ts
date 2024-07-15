import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true, nullable: false })
  usuario: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  contraseña: string;
}
