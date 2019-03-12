class TodoList {
    static KEY = 'TodoList';
    static PROJECT_INDEX = 'ProjectIndex';
    static TASK_INDEX = 'TaskIndex';
    projects = [];

    addProject(project) {
        const aThis = this;
        return Repository.createProject(new ProjectDTO(project.name, project.tasks))
            .then(res => {
                return res.json();
            })
            .then(createdProject => {
                console.log(aThis);
                aThis.projects.push(new Project(
                    createdProject.name,
                    createdProject.id,
                    createdProject.tasks
                ));
                return createdProject;
            });
    }

    removeProject(project) {
        if (typeof project === 'number') {
            this.projects = this.projects.slice(project, project);
        } else {
            this.projects = this.projects.filter(value => value !== project);
        }
    }

    findProjectById(id) {
        return this.projects.find(value => value.id === Number(id));
    }

    save() {
        localStorage.setItem(TodoList.KEY, JSON.stringify(this));
        localStorage.setItem(TodoList.PROJECT_INDEX, Project.last);
        localStorage.setItem(TodoList.TASK_INDEX, Task.last);
    }

    static load() {
        Project.last = Number(localStorage.getItem(TodoList.PROJECT_INDEX));
        Task.last = Number(localStorage.getItem(TodoList.TASK_INDEX));

        const todoList = new TodoList();
        const todoListDTO = JSON.parse(localStorage.getItem(TodoList.KEY));
        todoListDTO.projects.forEach(projectFromDTO => {
            const project = new Project(projectFromDTO.name, projectFromDTO.id);

            projectFromDTO.tasks.forEach(taskFromDTO => {
                const task = new Task(taskFromDTO.title, taskFromDTO.mark, taskFromDTO.id);
                project.addTask(task);
            });
            todoList.addProject(project);
        });

        return todoList;
    }

}

class Project {
    id;
    name;
    tasks = [];

    constructor(name, id, tasks) {
        this.name = name;
        this.id = id;
        this.tasks = tasks || [];
    }

    addTask(task) {
        const aThis = this;
        return Repository.createTask(new TaskDTO(task.title, task.mark))
            .then(res => res.json())
            .then(taskDTO => {
               aThis.tasks.push(new Task(taskDTO.title, taskDTO.mark, taskDTO.id));
               return taskDTO;
            });
    }

    removeTask(task) {
        if (typeof task === 'number') {
            this.tasks = this.tasks.slice(task, task);
        } else {
            this.tasks = this.tasks.filter(value => value !== task);
        }
    }

    findTaskById(id) {
        return this.tasks.find(value => value.id === Number(id));
    }

    static last = 0;
    static generateId() {
        return this.last++;
    }
}

class Task {
    id;
    title;
    mark;

    constructor(title, mark, id) {
        this.title = title;
        this.mark = mark || false;
        this.id = id || Task.generateId();
    }

    static last = 0;
    static generateId() {
        return Task.last++;
    }
}

class ProjectDTO {
    name;
    tasks = [];

    constructor(name, tasks) {
        this.name = name || "";
        this.tasks = tasks || [];
    }
}

class TaskDTO {
    title;
    mark;

    constructor(title, mark) {
        this.title = title || "";
        this.mark = mark || false;
    }
}

