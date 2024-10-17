import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tasks, TaskStatus } from './schemas/tasks.schema';
import { Model } from 'mongoose';
import { TaskChangeHistory } from './schemas/task-change-history.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { isValidId } from 'src/utils';
import { UserDecorator } from 'src/users/decorators/users.decorator';
import { Teams } from 'src/teams/schemas/teams.schema';
import { RolesEnum, Users } from 'src/users/schemas/users.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/sort-tasks.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {

    constructor(
        @InjectModel(Tasks.name) private readonly tasksModel: Model<Tasks>,
        @InjectModel(TaskChangeHistory.name) private readonly taskChangeHistoryModel: Model<TaskChangeHistory>,
        @InjectModel(Teams.name) private readonly teamsModel: Model<Teams>,
        @InjectModel(Users.name) private readonly usersModel: Model<Users>,

    ) { }

    @Cron(CronExpression.EVERY_5_MINUTES)
    public async checkTask() {
        const tasks = await this.tasksModel.find({status: {$nin: [TaskStatus.DONE, TaskStatus.OVERDUE]}});
        for (const task of tasks) {
            if (task.dueDate > Date.now()) continue;

            task.status = TaskStatus.OVERDUE;
            await task.save();

        }
    }

    public async create(dto: CreateTaskDto, user: UserDecorator) {
        if (dto.executors && !dto.executors.every(executor => isValidId(executor))) throw new HttpException('invalid executor id', HttpStatus.BAD_REQUEST);
        if (dto.team && !isValidId(dto.team)) throw new HttpException('invalid team id', HttpStatus.BAD_REQUEST);

        const task = new this.tasksModel({ ...dto, initiator: user.id, created: Date.now() });
        if (dto.team) {
            const team = await this.teamsModel.findById(dto.team);
            if (!team) throw new HttpException('team not found', HttpStatus.NOT_FOUND);
            task.team = team;
        }

        const history = await this.taskChangeHistoryModel.create({ created: Date.now(), oldProps: {}, props: task, task: task._id, user: user.id });
        task.changeHistory = [history];

        return await task.save();;
    }

    public async getAll(dto: GetTasksDto) {
        return await this.tasksModel.find({
            ...dto?.filter?.reduce((obj, filter) => ({ ...obj, [filter.filterProp]: filter.value }), {})
        }, {}, {
            populate: [
                { model: Users.name, path: 'initiator' },
                { model: Users.name, path: 'executors' },
                {
                    model: Teams.name, path: 'team', populate: [
                        { model: Users.name, path: 'members' },
                        { model: Users.name, path: 'responsible' },
                    ]
                },
                {
                    model: TaskChangeHistory.name, path: 'changeHistory', populate: [
                        { model: Users.name, path: 'user' }
                    ]
                },
            ],
            sort: dto?.sort ? { [dto.sort?.sortProp]: dto.sort?.order } : undefined,
        });
    }

    public async getById(id: string) {
        if (!isValidId(id)) throw new HttpException('Invalid task id', HttpStatus.BAD_REQUEST);
        return await this.tasksModel.findById(id, {}, {
            populate: [
                { model: Users.name, path: 'initiator' },
                { model: Users.name, path: 'executors' },
                {
                    model: Teams.name, path: 'team', populate: [
                        { model: Users.name, path: 'members' },
                        { model: Users.name, path: 'responsible' },
                    ]
                },
                {
                    model: TaskChangeHistory.name, path: 'changeHistory', populate: [
                        { model: Users.name, path: 'user' }
                    ]
                },
            ]
        });
    }

    public async getCurrentUserTasks(dto: GetTasksDto, user: UserDecorator) {
        return await this.tasksModel.find({
            $or: [{ initiator: user.id }, { executors: user.id }],
            ...dto?.filter?.reduce((obj, filter) => ({ ...obj, [filter.filterProp]: filter.value }), {})
        }, {}, {
            populate: [
                { model: Users.name, path: 'initiator' },
                { model: Users.name, path: 'executors' },
                {
                    model: Teams.name, path: 'team', populate: [
                        { model: Users.name, path: 'members' },
                        { model: Users.name, path: 'responsible' },
                    ]
                },
                {
                    model: TaskChangeHistory.name, path: 'changeHistory', populate: [
                        { model: Users.name, path: 'user' }
                    ]
                },
            ],
            sort: dto?.sort ? { [dto.sort?.sortProp]: dto.sort?.order } : undefined,
        });
    }

    public async update(dto: UpdateTaskDto, user: UserDecorator) {
        const task = await this.getById(dto.id);
        if (!task) throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
        if (!user.roles.includes(RolesEnum.ADMIN) && !task.team?.members.some(v => v._id === user.id) && task.initiator._id !== user.id)
            throw new HttpException('Access denied', HttpStatus.FORBIDDEN)



        const oldProps = Object.keys(dto).reduce((obj, key) => ({ ...obj, [key]: task[key] }), {});

        if (dto.team && isValidId(dto.team)) {
            if (!user.roles.includes(RolesEnum.ADMIN) || task.initiator._id !== user.id) throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
            const team = await this.teamsModel.findById(dto.team);
            if (!team) throw new HttpException(`Invalid team id ${dto.team}`, HttpStatus.NOT_FOUND);
            const members = await this.usersModel.find({ _id: { $in: [...team.members, ...task.executors] } });

            dto.executors.push(...team.members.map(member => member._id));

            for (const member of members) {
                if (dto.executors.some(exec => exec === member._id)) continue;

                member.tasks = member.tasks.filter(v => v._id !== dto.id);
                member.save();
            }

            task.team = team;
        }

        task.dueDate = dto.dueDate || task.dueDate;
        task.title = dto.title || task.title;
        task.description = dto.task || task.description;
        task.status = dto.status || task.status;

        if (dto.executors) {
            if (!user.roles.includes(RolesEnum.ADMIN) || task.initiator._id !== user.id) throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
            const executors = await this.usersModel.find({ _id: { $in: task.executors } });
            for (const execcutor of executors) {
                if (dto.executors.some(exec => exec === execcutor._id)) continue;

                execcutor.tasks = execcutor.tasks.filter(v => v._id !== dto.id);
                execcutor.save();
            }
            task.executors = await Promise.all(dto.executors.map(async (executor) => {
                if (!isValidId(executor)) throw new HttpException(`Invalid executor id ${executor}`, HttpStatus.BAD_REQUEST);

                const user = await this.usersModel.findById(executor);
                if (!user) throw new HttpException(`Incorrect executor id ${executor}`, HttpStatus.BAD_REQUEST);
                user.tasks = user.tasks.some(v => v._id === dto.id) ? user.tasks : [...user.tasks, task];
                user.save();
                return user;
            }));
        }



        const history = await this.taskChangeHistoryModel.create({ created: Date.now(), oldProps, props: task, task: task._id, user: user.id });
        task.changeHistory.push(history);

        return await task.save();
    }

}
