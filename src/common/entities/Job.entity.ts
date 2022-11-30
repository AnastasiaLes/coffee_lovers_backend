import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@entities/User.entity';
import { Category } from '@entities/Category.entity';
import { Skill } from '@entities/Skill.entity';
import { Proposal } from '@entities/Proposal.entity';
import { EnglishLevel } from '@constants/entities';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  title: string;

  @Column({ default: null, nullable: true })
  description: string;

  @Column({ default: null, nullable: true })
  hourly_rate: number;

  @Column({ default: null, nullable: true })
  available_time: number;

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    nullable: true,
    default: null,
  })
  english_level: EnglishLevel;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.jobs)
  owner: User;

  @ManyToOne(() => Category, (category) => category.jobs)
  category: Category;

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];

  @OneToMany(() => Proposal, (proposal) => proposal.job)
  proposals: Proposal[];
}
