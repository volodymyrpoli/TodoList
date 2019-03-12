class Repository {
    static BASE_URL = window.location.origin;

    static getProjects() {
        return fetch(`${this.BASE_URL}/projects`);
    }

    static getTasks() {
        return fetch(`${this.BASE_URL}/tasks`);
    }

    static createProject(projectDTO) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        return fetch(`${this.BASE_URL}/projects`, {
            method: 'POST',
            body: JSON.stringify(projectDTO),
            headers: headers
        });
    }

    static createTask(taskDTO) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        return fetch(`${this.BASE_URL}/tasks`, {
            method: 'POST',
            body: JSON.stringify(taskDTO),
            headers: headers
        });
    }

    static deleteProject(id) {
        return fetch(`${this.BASE_URL}/projects/${id}`, {
            method: 'DELETE'
        });
    }

    static deleteTask(id) {
        return fetch(`${this.BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    static changeMarkForTask(task, mark) {
        return this.updateFields(`${this.BASE_URL}/tasks/${task.id}`, { mark: mark });
    }

    static changeTaskName(task, title) {
        return this.updateFields(`${this.BASE_URL}/tasks/${task.id}`, { title: title });
    }

    static updateFields(url, fields) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(fields),
            headers: headers
        });
    }

}
