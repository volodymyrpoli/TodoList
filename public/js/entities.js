class TodoList {
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
        return Repository.deleteProject(project.id)
            .then(res => {
                this.projects = this.projects.filter(value => value !== project);
                return res.json();
            });
    }

    findProjectById(id) {
        return this.projects.find(value => value.id === Number(id));
    }

    load() {
        const aThis = this;
        let projectsFromServer;
        return Repository.getProjects()
            .then(res => res.json())
            .then(projects => {
                projectsFromServer = projects;
                return Repository.getTasks();
            })
            .then(res => res.json())
            .then(tasks => {
                for (let i = 0; i < projectsFromServer.length; i++) {
                    const tProject = new Project(projectsFromServer[i].name, projectsFromServer[i].id, []);
                    for (let j = 0; j < tasks.length; j++) {
                        if (tasks[j].projectId === tProject.id) {
                            tProject.tasks.push(new Task(tasks[j].title, tasks[j].mark, tasks[j].id));
                        }
                    }
                    aThis.projects.push(tProject);
                }
            })
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
        return Repository.createTask(new TaskDTO(task.title, task.mark, this.id))
            .then(res => res.json())
            .then(taskDTO => {
                aThis.tasks.push(new Task(taskDTO.title, taskDTO.mark, taskDTO.id));
                return taskDTO;
            });
    }

    removeTask(task) {
        Repository.deleteTask(task.id)
            .then(taskDTO => {
                this.tasks = this.tasks.filter(value => value !== task);
            });
    }

    findTaskById(id) {
        return this.tasks.find(value => value.id === Number(id));
    }

}

class Task {
    id;
    title;
    mark;

    constructor(title, mark, id) {
        this.title = title;
        this.mark = mark || false;
        this.id = id;
    }

    setMark(value) {
        return Repository.changeMarkForTask(this, value)
            .then(res => res.json())
            .then(newTask => {
                this.mark = newTask.mark;
                return this.mark;
            });
    }

    setTitle(title) {
        return Repository.changeTaskName(this, title)
            .then(res => res.json())
            .then(task => {
                this.title = task.title;
                return task.title;
            })
    }
}

// DTOs

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
    projectId;

    constructor(title, mark, projectId) {
        this.title = title || "";
        this.mark = mark || false;
        this.projectId = projectId;
    }
}

