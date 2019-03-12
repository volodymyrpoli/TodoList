class Repository {
    static BASE_URL = window.location.origin;

    static getProjects() {
        return fetch(`${this.BASE_URL}/projects`, {
            method: 'GET'
        });
    }

    static getProject(id) {
        return fetch(`${this.BASE_URL}/projects/${id}`, {
            method: 'GET'
        });
    }

    static getTasks() {
        return fetch(`${this.BASE_URL}/tasks`, {
            method: 'GET'
        });
    }

    static getTask(id) {
        return fetch(`${this.BASE_URL}/tasks/${id}`, {
            method: 'GET'
        });
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


}
