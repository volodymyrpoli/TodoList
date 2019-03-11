const todoList = new TodoList();

document.body.onload = () => {

    document.querySelector('#projectList')
        .addEventListener('click', onDeleteProject);
    document.querySelector('#projectList')
        .addEventListener('click', onSelectProject);

    document.querySelector('#projectTasksList')
        .addEventListener('click', onDeleteTask);

    const project = new Project('Default');
    project.addTask(new Task('Good first task'), false);
    todoList.addProject(project);

    fillTodoList();
};

function createProject(e) {
    e.preventDefault();
    const projectName = document.forms['projectForm'].projectName.value;
    const project = new Project(projectName);
    const projectId = todoList.addProject(project);
    addItemToProjectList(project, projectId);

    document.forms['projectForm'].reset();
}

function createTask(e) {
    e.preventDefault();
    const taskName = document.forms['tasksForm'].taskName.value;
    const projectId = Number(document.querySelector('#projectTasksList').getAttribute('data-project-id'));
    const task = new Task(taskName);
    const taskId = todoList.projects[projectId].addTask(task);
    addItemToProjectTaskList(task, taskId);

    document.forms['tasksForm'].reset();
}

function addItemToProjectList(project, projectId) {
    const projectList = document.querySelector('#projectList');
    projectList.appendChild(createProjectListItem(project, projectId));
}

function addItemToProjectTaskList(task, taskId) {
    const projectTaskList = document.querySelector('#projectTasksList');
    projectTaskList.appendChild(createTaskListItem(task, taskId));
}

function fillTodoList() {
    const projectList = document.querySelector('#projectList');

    while (projectList.hasChildNodes()) {
        projectList.firstChild.remove();
    }
    todoList.projects.forEach((value, index) => {
       projectList.appendChild(createProjectListItem(value, index));
    });
    if (todoList.projects[0]) {
        fillTasksList(todoList.projects[0]);
    }
}

function fillTasksList(project) {
    const tasksList = document.querySelector('#projectTasksList');

    document.querySelector('#currentSelectedProjectName').innerHTML = project.name;
    tasksList.setAttribute('data-project-id', '' + todoList.getProjectId(project));
    while (tasksList.hasChildNodes()) {
        tasksList.firstChild.remove();
    }
    project.tasks.forEach((value, index) => {
        tasksList.appendChild(createTaskListItem(value, index));
    });
}

// listeners

function onDeleteProject(e) {
    if (e.target.matches('input[type=button]') && e.target.dataset.projectId) {
        const project = todoList.projects[e.target.dataset.projectId];
        if (project) {
            todoList.removeProject(project);
            e.target.parentElement.remove();

            // TODO select other project
        }
    }
}

function onSelectProject(e) {
    if (e.target.matches('li') && e.target.dataset.projectId) {
        const project = todoList.projects[e.target.dataset.projectId];
        if (project) {
            fillTasksList(project);
        }
    }
}

function onDeleteTask(e) {
    if (e.target.matches('input[type=button]') && e.target.closest('li').dataset.taskId) {
        const projectId = document.querySelector('#projectTasksList').dataset.projectId;
        const project = todoList.projects[projectId];
        const taskId = e.target.closest('li').dataset.taskId;
        if (projectId && project) {
            const task = project.tasks[taskId];
            project.removeTask(task);

            e.target.parentElement.remove();
        }
    }
}

// end - listeners

// create html elements methods

function createProjectListItem(project, id) {
    const li = document.createElement('li');
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Delete');
    button.setAttribute('data-project-id', id);
    li.innerHTML = project.name;
    li.setAttribute('data-project-id', id);
    li.appendChild(button);
    return li;
}

function createTaskListItem(task, id) {
    const li = document.createElement('li');
    li.setAttribute('data-task-id', id);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('title', 'Toggle completion');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = task.mark;
    const removeButton = document.createElement('input');
    removeButton.setAttribute('value', 'Delete');
    removeButton.setAttribute('type', 'button');
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(task.title));
    li.appendChild(removeButton);
    return li;
}

// end -- create html elements methods
