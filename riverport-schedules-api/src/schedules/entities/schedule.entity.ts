import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Route } from '../../routes/entities/route.entity';
import { ScheduleStatus } from '../dto/schedule.dto';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column()
  routeId: string;

  @Column({ nullable: true })
  boatId: string;

  @Column({ type: 'timestamp with time zone' })
  departureTime: Date;

  @Column({ type: 'timestamp with time zone' })
  arrivalTime: Date;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.SCHEDULED,
  })
  status: ScheduleStatus;

  @ManyToOne(() => Route, route => route.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route: Route;
}