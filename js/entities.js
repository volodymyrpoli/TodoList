class TodoList {
    projects = [];

    addProject(project) {
        this.projects.push(project);
        project.owner = this;
        return this.projects.length - 1;
    }

    removeProject(project) {
        if (typeof project === 'number') {
            this.projects = this.projects.slice(project, project);
        } else {
            this.projects = this.projects.filter(value => value !== project);
        }
    }

    getProjectId(project) {
        let result = null;
        this.projects.forEach((value, index) => {
            if (value === project) {
                result = index;
            }
        });
        return result;
    }

    findProjectById(id) {
        return this.projects.find(value => value.id === Number(id));
    }

}

class Project {
    id;
    name;
    tasks = [];
    owner;

    constructor(name) {
        this.name = name;
        this.tasks = Array.prototype.slice.call(arguments, [1]);
        this.id = Project.generateId();
    }

    addTask(task) {
        this.tasks.push(task);
        task.owner = this;
        return this.tasks.length - 1;
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

    static ids = [];
    static generateId() {
        this.ids.push(this.ids.length);
        return this.ids.length - 1;
    }
}

class Task {
    id;
    title;
    mark;
    owner;

    constructor(title, mark) {
        this.title = title;
        this.mark = mark || false;
        this.id = Task.generateId();
    }

    static ids = [];
    static generateId() {
        this.ids.push(this.ids.length);
        return this.ids.length - 1;
    }
}

