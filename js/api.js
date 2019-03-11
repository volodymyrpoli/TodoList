const todoList = new TodoList();

document.body.onload = () => {

    document.querySelector('#projectList')
        .addEventListener('click', onDeleteProject);
    document.querySelector('#projectList')
        .addEventListener('click', onSelectProject);

    const project = new Project('Created in code');
    project.addTask(new Task('some one'), false);
    project.addTask(new Task('some two'), true);
    todoList.addProject(project);

    fillTasksList(project);

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
    projectList.appendChild(createProjectListItem(project.name, projectId));
}

function addItemToProjectTaskList(task, taskId) {
    const projectTaskList = document.querySelector('#projectTasksList');
    projectTaskList.appendChild(createTaskListItem(task, taskId));
}

function onDeleteProject(e) {
    if (e.target.matches('input[type=button]') && e.target.dataset.projectId) {
        const project = todoList.projects[e.target.dataset.projectId];
        if (project) {
            todoList.removeProject(project);
            e.target.parentElement.remove();
        }
    }
}

function onSelectProject(e) {
    console.dir(e);
    if (e.target.matches('li') && e.target.dataset.projectId) {
        const project = todoList.projects[e.target.dataset.projectId];
        if (project) {
            fillTasksList(project);
        }
    }
}

function fillTasksList(project) {
    const tasksList = document.querySelector('#projectTasksList');
    console.log(todoList.getProjectId(project));
    console.dir(todoList.getProjectId(project));

    tasksList.setAttribute('data-project-id', '' + todoList.getProjectId(project));
    while (tasksList.hasChildNodes()) {
        tasksList.firstChild.remove();
    }
    project.tasks.forEach((value, index) => {
        tasksList.appendChild(createTaskListItem(value, index));
    });
}

// create html elements methods

function createProjectListItem(name, id) {
    const li = document.createElement('li');
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Delete');
    button.setAttribute('data-project-id', id);
    li.innerHTML = name;
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
