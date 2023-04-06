import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'user/models';

@Entity({ name: 'notes' })
export class Note {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'body', type: 'text' })
    public body: string;

    @Column({ name: 'shared' })
    public shared: boolean;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date;

    @Index()
    @Column({ name: 'author_id' })
    public author_id: number;

    @ManyToOne(type => User, { nullable: false, eager: true })
    @JoinColumn({ name: 'author_id' })
    public author: User;
}