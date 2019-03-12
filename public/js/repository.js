class Repository {

    static getProjects() {
        return fetch(`${window.location.origin}/projects`);
    }

    static getTasks() {
        return fetch(`${window.location.origin}/tasks`);
    }

    static createProject(projectDTO) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        return fetch(`${window.location.origin}/projects`, {
            method: 'POST',
            body: JSON.stringify(projectDTO),
            headers: headers
        });
    }

    static createTask(taskDTO) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        return fetch(`${window.location.origin}/tasks`, {
            method: 'POST',
            body: JSON.stringify(taskDTO),
            headers: headers
        });
    }

    static deleteProject(id) {
        return fetch(`${window.location.origin}/projects/${id}`, {
            method: 'DELETE'
        });
    }

    static deleteTask(id) {
        return fetch(`${window.location.origin}/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    static changeMarkForTask(task, mark) {
        return this.updateFields(`${window.location.origin}/tasks/${task.id}`, { mark: mark });
    }

    static changeTaskName(task, title) {
        return this.updateFields(`${window.location.origin}/tasks/${task.id}`, { title: title });
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
