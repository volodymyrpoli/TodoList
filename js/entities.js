class TodoList {
    projects = [];

    addProject(project) {
        this.projects.push(project);
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
}

class Project {
    name;
    tasks = [];

    constructor(name) {
        this.name = name;
        this.tasks = Array.prototype.slice.call(arguments, [1]);
    }

    addTask(task) {
        this.tasks.push(task);
        return this.tasks.length - 1;
    }

    removeTask(task) {
        if (typeof task === 'number') {
            this.tasks = this.tasks.slice(task, task);
        } else {
            this.tasks = this.tasks.filter(value => value !== task);
        }
    }
}

class Task {
    title;
    mark;

    constructor(title, mark) {
        this.title = title;
        this.mark = mark || false;
    }
}

