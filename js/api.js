const todoList = new TodoList();

document.body.onload = () => {

    document.querySelector('#projectList')
        .addEventListener('click', onDeleteProject);
    document.querySelector('#projectList')
        .addEventListener('click', onSelectProject);

    document.querySelector('#projectTasksList')
        .addEventListener('click', onDeleteTask);
    document.querySelector('#projectTasksList')
        .addEventListener('click', onMarkTask);
    document.body.addEventListener('input', onChangeTaskTitle);

    const project = new Project('Default');
    project.addTask(new Task('Good first task'), false);
    todoList.addProject(project);

    fillTodoList();
};

function createProject(e) {
    e.preventDefault();
    const projectName = document.forms['projectForm'].projectName.value;
    const project = new Project(projectName);
    todoList.addProject(project);
    addItemToProjectList(project);

    document.forms['projectForm'].reset();
}

function createTask(e) {
    e.preventDefault();
    const taskName = document.forms['tasksForm'].taskName.value;
    const projectId = Number(document.querySelector('#projectTasksList').getAttribute('data-project-id'));
    const task = new Task(taskName);
    todoList.projects[projectId].addTask(task);
    addItemToProjectTaskList(task);

    document.forms['tasksForm'].reset();
}

function addItemToProjectList(project) {
    const projectList = document.querySelector('#projectList');
    projectList.appendChild(createProjectListItem(project));
}

function addItemToProjectTaskList(task) {
    const projectTaskList = document.querySelector('#projectTasksList');
    projectTaskList.appendChild(createTaskListItem(task));
}

function fillTodoList() {
    const projectList = document.querySelector('#projectList');

    while (projectList.hasChildNodes()) {
        projectList.firstChild.remove();
    }
    todoList.projects.forEach((value) => {
       projectList.appendChild(createProjectListItem(value));
    });
    if (todoList.projects[0]) {
        fillTasksList(todoList.projects[0]);
    }
}

function fillTasksList(project) {
    const tasksList = document.querySelector('#projectTasksList');

    document.querySelector('#currentSelectedProjectName').innerHTML = project.name;
    tasksList.setAttribute('data-project-id', project.id);

    clearTasksList();

    project.tasks.forEach((value) => {
        tasksList.appendChild(createTaskListItem(value));
    });
}

function clearTasksList() {
    const tasksList = document.querySelector('#projectTasksList');

    while (tasksList.hasChildNodes()) {
        tasksList.firstChild.remove();
    }
}

function selectOtherProjectIfNowSelected(project) {
    const currentSelectedProject = document.querySelector('#projectTasksList').dataset.projectId;
    if (currentSelectedProject && project.id === Number(currentSelectedProject)) {
        if (todoList.projects[0]) {
            fillTasksList(todoList.projects[0]);
        } else {
            clearTasksList();
        }
    }
}

// listeners

function onDeleteProject(e) {
    if (e.target.matches('input[type=button]') && e.target.dataset.projectId) {
        const project = todoList.findProjectById(e.target.dataset.projectId);
        if (project) {
            todoList.removeProject(project);
            e.target.parentElement.remove();
            debugger;
            selectOtherProjectIfNowSelected(project);
        }
    }
}

function onSelectProject(e) {
    if (e.target.matches('li') && e.target.dataset.projectId) {
        const project = todoList.findProjectById(e.target.dataset.projectId);
        if (project) {
            fillTasksList(project);
        }
    }
}

function onDeleteTask(e) {
    if (e.target.matches('input[type=button]') && e.target.closest('li').dataset.taskId) {
        const projectId = document.querySelector('#projectTasksList').dataset.projectId;
        const project = todoList.findProjectById(projectId);
        const taskId = e.target.closest('li').dataset.taskId;
        if (projectId && project) {
            const task = project.findTaskById(taskId);
            project.removeTask(task);

            e.target.parentElement.remove();
        }
    }
}

function onMarkTask(e) {
    if (e.target.matches('input[type=checkbox]') && e.target.closest('li').dataset.taskId) {
        const projectId = document.querySelector('#projectTasksList').dataset.projectId;
        const project = todoList.findProjectById(projectId);
        const taskId = e.target.closest('li').dataset.taskId;
        if (projectId && project) {
            const task = project.findTaskById(taskId);
            task.mark = e.target.checked;
            console.dir(task);
        }
    }
}

function onChangeTaskTitle(e) {
    if (e.target.matches('span[contenteditable=true]') && e.target.closest('li').dataset.taskId) {
        const projectId = document.querySelector('#projectTasksList').dataset.projectId;
        const project = todoList.findProjectById(projectId);
        const taskId = e.target.closest('li').dataset.taskId;
        if (projectId && project) {
            const task = project.findTaskById(taskId);
            task.title = e.target.innerText;
        }
    }
}

// end - listeners

// create html elements methods

function createProjectListItem(project) {
    const li = document.createElement('li');
    const button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Delete');
    button.setAttribute('data-project-id', project.id);
    li.innerHTML = project.name;
    li.setAttribute('data-project-id', project.id);
    li.appendChild(button);
    return li;
}

function createTaskListItem(task) {
    const li = document.createElement('li');
    li.setAttribute('data-task-id', task.id);
    const checkbox = document.createElement('input');
    checkbox.setAttribute('title', 'Toggle completion');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = task.mark;
    const removeButton = document.createElement('input');
    removeButton.setAttribute('value', 'Delete');
    removeButton.setAttribute('type', 'button');
    const title = document.createElement('span');
    title.setAttribute('contenteditable', 'true');
    title.innerText = task.title;
    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(removeButton);
    return li;
}

// end -- create html elements methods
