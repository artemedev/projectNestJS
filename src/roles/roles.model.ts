import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserRoles } from "./user-roles.model";


interface RoleCreationAttrs{
    value: string;
    description:string;
}
@Table({ tableName: "Roles" })
export class Role extends Model<Role, RoleCreationAttrs> {
    @ApiProperty({example:'1',description:'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER,unique: true,autoIncrement: true,primaryKey: true,})
    id: number;
    
    @ApiProperty({example:'ADMIN',description:'Уникальное значение роли'})
    @Column({type: DataType.STRING,unique: true,allowNull: false,})
    value: string;

    @ApiProperty({example:'Адмиинистратор',description:'Описание роли'})
    @Column({type: DataType.STRING,allowNull: false,})
    description: string;

    @BelongsToMany(()=> User, ()=>UserRoles)
    users:User[];
}
