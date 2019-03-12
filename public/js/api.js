let todoList = new TodoList();

document.body.onload = () => {

    document.querySelector('#projectList').addEventListener('click', onDeleteProject);
    document.querySelector('#projectList').addEventListener('click', onSelectProject);

    document.querySelector('#projectTasksList').addEventListener('click', onDeleteTask);
    document.querySelector('#projectTasksList').addEventListener('click', onMarkTask);
    document.querySelector('#projectTasksList').addEventListener('blur', onBlurTaskTitle);
    document.querySelector('#projectTasksList').addEventListener('keydown', onKeyDownOnTitle);

    todoList.load().then(fillTodoList);

};

function createProject(e) {
    e.preventDefault();
    const projectName = document.forms['projectForm'].projectName.value;
    const project = new Project(projectName);
    todoList.addProject(project).then(projectDTO => {
        addItemToProjectList(projectDTO);
    });

    document.forms['projectForm'].reset();
}

function createTask(e) {
    e.preventDefault();
    const taskName = document.forms['tasksForm'].taskName.value;
    const projectId = Number(document.querySelector('#projectTasksList').getAttribute('data-project-id'));
    const task = new Task(taskName);
    todoList.findProjectById(projectId).addTask(task)
        .then(taskFromServer => {
            addItemToProjectTaskList(taskFromServer);
        });

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
            todoList.removeProject(project).then(projectDTO => {
                e.target.parentElement.remove();
                selectOtherProjectIfNowSelected(project);
            });
        }
    }
}

function onSelectProject(e) {
    if (e.target.matches('li') && e.target.dataset.projectId) {
        const project = todoList.findProjectById(e.target.dataset.projectId);
        if (project) {
            fillTasksList(project);
            highlightProject(project);
        }
    }
}

function highlightProject(project) {
    const ul = document.querySelector('#projectList');
    Array.prototype.forEach.call(ul.children, (value) => {
        value.classList.remove('selected__project');
        if (Number(value.dataset.projectId) === project.id) {
            value.classList.add('selected__project');
        }
    });
}

function onDeleteTask(e) {
    doInMatches(e, 'input[type=button]', (event, project, task) => {
        project.removeTask(task);

        e.target.parentElement.remove();
    });
}

function onMarkTask(e) {
    doInMatches(e, 'input[type=checkbox]', (event, project, task) => {
        task.setMark(e.target.checked)
            .then(newMark => e.target.checked = newMark);
    });
}

function onBlurTaskTitle(e) {
    doInMatches(e, 'span[contenteditable=true]', (event, project, task) => {
        debugger;
        task.title = e.target.innerText;
    });
}

function onKeyDownOnTitle(e) {
    doInMatches(e, 'span[contenteditable=true]', (event, project, task) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            task.title = e.target.innerText;
            event.target.blur();
        } else if (event.code === 'Escape') {
            event.preventDefault();
            e.target.innerText = task.title;
            event.target.blur();
        }
    });
}

function doInMatches(e, selector, handler) {
    if (e.target.matches(selector) && e.target.closest('li').dataset.taskId) {
        const projectId = document.querySelector('#projectTasksList').dataset.projectId;
        const project = todoList.findProjectById(projectId);
        const taskId = e.target.closest('li').dataset.taskId;
        if (projectId && project) {
            const task = project.findTaskById(taskId);

            handler(event, project, task);
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
    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(title);
    li.appendChild(div);
    li.appendChild(removeButton);
    return li;
}

// end -- create html elements methods
