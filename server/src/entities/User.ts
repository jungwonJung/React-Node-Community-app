import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import bcrypt from "bcryptjs";
import BaseEntity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "The email address is invalid." })
  @Length(1, 255, { message: "The email address cannot be left blank." })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, {
    message: "The username must be at least 3 characters long.",
  })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, {
    message: "The password must be at least 6 characters long.",
  })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
