import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from '@entities/Job.entity';
import { User } from '@entities/User.entity';
import { coverLetterMaxLength, OfferStatus } from '@constants/entities';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.offers)
  job: Job;

  @ManyToOne(() => User, (user) => user.offers)
  job_owner: User;

  @ManyToOne(() => User, (user) => user.offers)
  freelancer: User;

  @Column({ default: null, nullable: true })
  hourly_rate: number;

  @Column({
    type: 'enum',
    enum: OfferStatus,
    nullable: false,
    default: OfferStatus.PENDING,
  })
  status: OfferStatus;

  @Column()
  start: string;

  @Column({
    type: 'varchar',
    length: coverLetterMaxLength,
    default: null,
    nullable: true,
  })
  cover_letter: string;

  @CreateDateColumn()
  created_at: Date;
}
