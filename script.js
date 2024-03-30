const data = [];
loadData();
renderTodo();

function addTodo(){
    const taskElement = document.getElementById('input-task');
    const task = taskElement.value;

    const dueDateElement = document.getElementById('input-date');
    const dueDate = dueDateElement.value;

    if ( task === '' && dueDate === '' || task === ''){
        showModal('Task');
    }
    else if (dueDate === ''){
        showModal('Due date');
    }
    else {
        data.push({
            task,
            dueDate,
            isChecked: false
        });
    
        renderTodo();
        taskElement.value = '';
        dueDateElement.value = '';
    }
}

function renderTodo(){
    let dataHTML = '';

    if ( data && data.length > 0){
        data.forEach(dataObject => {
            const {task, dueDate} = dataObject;
            /* console.log('dueDate: ', dueDate); */
            const listDate = new Date(dueDate);
            const formatter = new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
            const formattedDate = formatter.format(listDate);
            const html = `
                <div class="row-list">
                    <div class="task">${task}</div>
                    <div class="due-date"><img class="alarm-icon" src="icons/alarm.svg"> ${formattedDate}</div>
                    <button class="js-delete-button delete-btn">&#215;</button>
                </div>
            `;
            dataHTML+=html;
        });
    }

    dataHTML =
        '<div class="reset-row"><button class="reset-btn">Reset</button></div>'
        + dataHTML;

    document.getElementById('list-container')
        .innerHTML = dataHTML;

    document.querySelectorAll('.js-delete-button')
        .forEach((deleteButton, index) => {
            deleteButton.addEventListener('click', () => {
                data.splice(index, 1);
                renderTodo();
            });
        });

    document.querySelector('.reset-btn')
        .addEventListener('click', () => resetModal());

    if ( !data.length){
        document.querySelector('.reset-row')
            .remove();
    }

    document.querySelectorAll('.task')
        .forEach((checkButton, index) => {
            if ( data[index].isChecked){
                checkButton.classList.add('task-checked');
            }

            checkButton.addEventListener('click', e => {
                e.target.classList.toggle('task-checked');
                if ( e.target.classList.contains('task-checked')){
                    data[index].isChecked = true;
                }
                else {
                    data[index].isChecked = false;
                }
                saveData();
            });
        });
    
    saveData();
}

document.getElementById('js-add-todo')
    .addEventListener('click', () => addTodo());

document.getElementById('input-task')
    .addEventListener('keydown',
        () => event.key === 'Enter' ? addTodo() : false);

function showModal(text){
    const overlay = document.querySelector('.js-overlay');
    overlay.classList.add('overlay');

    const modal = document.querySelector('.js-modal-container');
    modal.innerHTML = `${text} cannot be empty!`;
    modal.classList.add('modal-container');

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '\u00d7';
    modal.appendChild(closeButton);

    const clearOverlay = () => {
        overlay.classList.remove('overlay');
        modal.classList.remove('modal-container');
        modal.innerHTML = '';
    };

    document.body.addEventListener('keydown',
        () => event.key === 'Delete' || event.key === 'Escape' ? clearOverlay() : false);

    closeButton.addEventListener('click', () => clearOverlay());
}

function resetModal(){
    const overlay = document.querySelector('.js-overlay');
    overlay.classList.add('overlay');

    const modal = document.querySelector('.js-modal-container');
    modal.innerHTML = 'Are you sure that you want to delete all the task(s)?';
    modal.classList.add('modal-container');

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '\u00d7';
    modal.appendChild(closeButton);

    const yesButton = document.createElement('button');
    yesButton.innerHTML = 'Yes';
    yesButton.classList.add('yes-btn');

    const noButton = document.createElement('button');
    noButton.innerHTML = 'No';
    noButton.classList.add('no-btn');

    modal.appendChild(yesButton);
    modal.appendChild(noButton);

    const clearOverlay = () => {
        overlay.classList.remove('overlay');
        modal.classList.remove('modal-container');
        modal.innerHTML = '';
    };

    const resetAll = () => {
        data.splice(0, data.length);
        renderTodo();
    };

    closeButton.addEventListener('click', () => {
        clearOverlay();
    });

    noButton.addEventListener('click', () => {
        clearOverlay();
    });

    yesButton.addEventListener('click', () => {
        clearOverlay();
        resetAll();
    });
}

function saveData(){
    localStorage.setItem('data', JSON.stringify(data));
}

function loadData(){
    const savedData = localStorage.getItem('data');
    if ( savedData){
        data.push(...JSON.parse(savedData));
    }
    console.log(data);
}