// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функции
function addTask(event) {
	// Отменяем отправку формы
	event.preventDefault();

	// Достаем текст задачи из поля ввода
	const taskText = taskInput.value;

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	// Добавляем задачу в массив с задачами
	tasks.push(newTask);

	// Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

	// Рендерим задачу на странице
	renderTask(newTask);

	// Очищаем поле ввода и возвращаем на него фокус
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function deleteTask(event) {
	// Проверяем если клик был НЕ по кнопке "удалить задачу"
	if (event.target.dataset.action !== 'delete') return;

	const parenNode = event.target.closest('.list-group-item');

	// Определяем ID задачи
	const id = Number(parenNode.id);

	// Удаляем задча через фильтрацию массива
	tasks = tasks.filter((task) => task.id !== id);

	// Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

	// Удаляем задачу из разметки
	parenNode.remove();

	checkEmptyList();
}

function doneTask(event) {
	// Проверяем что клик был НЕ по кнопке "задача выполнена"
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('.list-group-item');

	// Определяем ID задачи
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	// Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
							
							<svg viewBox="0 0 200 200" width="100" height="100">
								<defs>
									<radialGradient id="gradient--bw-light" fy="10%">
										<stop offset="60%"
											stop-color="black"
											stop-opacity="0"/>
										<stop offset="90%"
											stop-color="white"
											stop-opacity=".25"/>
										<stop offset="100%"
											stop-color="black"/>
									</radialGradient>
									
									<!-- Маска для нижнего отражения -->
									<mask id="mask--light-bottom">
										<rect fill="url(#gradient--bw-light)"
											width="100%" height="100%"></rect>
									</mask>
									
									<!-- Маска для верхнего отражения -->
									<mask id="mask--light-top">
										<rect fill="url(#gradient--bw-light)"
											width="100%" height="100%"
											transform="rotate(180, 100, 100)"></rect>
									</mask>
									
									<!-- Нижнее отражение -->
									<circle r="50%" cx="50%" cy="50%"
										fill="aqua"
										mask="url(#mask--light-bottom)">
									</circle>
									
									<!-- Верхнее отражение -->
									<circle r="50%" cx="50%" cy="50%"
										fill="purple"
										mask="url(#mask--light-top)">
									</circle>
								</defs>
							
								<!-- Нижний блик -->
								<ellipse rx="40" ry="20" cx="150" cy="150"
									fill="url(#gradient--spot)"
									transform="rotate(-225, 150, 150)">
								</ellipse>
							
								<!-- Нижнее отражение -->
								<circle r="50%" cx="50%" cy="50%"
									fill="aqua"
									mask="url(#mask--light-bottom)">
								</circle>
							
								<!-- Верхнее отражение -->
								<circle r="50%" cx="50%" cy="50%"
									fill="pink"
									mask="url(#mask--light-top)">
								</circle>
							
								<!-- Верхний блик -->
								<ellipse rx="55" ry="25" cx="55" cy="55"
									fill="url(#gradient--spot)"
									transform="rotate(-45, 55, 55)">
								</ellipse>
							
								<!-- Фигура с маской и разноцветным градиентом -->
								<circle r="50%" cx="50%" cy="50%"
									fill="url(#gradient--colors)"
									mask="url(#mask--colors-transparency)">
								</circle>
							
							</svg>
							<div class="empty-list__title">Список дел пуст</div>
						</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формируем CSS класс
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	// Формируем разметку для новой задачи
	const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

	// Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
