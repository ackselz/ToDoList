import {
    itemStorage,
    projectStorage,
    dateStorage,
    Item,
    addItem,
    removeItem,
    cacheDates,
    sortItemsByDate,
    cacheProjects
} from './appLogic.js'

import { format, isEqual, isToday, isPast, isBefore, add, differenceInCalendarDays, startOfToday, isAfter, endOfYesterday } from 'date-fns'
import { endOfToday } from 'date-fns/esm';

const toDoListContainer = document.getElementById("todolist");
const addItemFormContainer = document.getElementById("new-item");
const projectsListContainer = document.getElementById("projects-list");
const buttonOpenForm = document.getElementById("open-form");
const buttonAddItem = document.getElementById("add-item");
const buttonCloseForm = document.getElementById("delete-item");
const buttonInbox = document.getElementById("inbox");
const buttonToday = document.getElementById("today");
const buttonWeek = document.getElementById("week");

buttonAddItem.addEventListener("click", () => {
    newItem();
});

buttonOpenForm.addEventListener("click", () => {
    addItemFormContainer.className = "form--maximised"
});

buttonCloseForm.addEventListener("click", () => {
    addItemFormContainer.className = "form--minimised"
});

toDoListContainer.addEventListener("click", (e) => {
    if (e.target.dataset.index) {
        removeItem(e.target.dataset.index);
        displayInboxItems();
    }
});

toDoListContainer.addEventListener("mouseover", (e) => {
    if (e.target.dataset.index) {
        e.target.src = "images/radio_button_checked_black_24dp.svg";
    }
});

toDoListContainer.addEventListener("mouseout", (e) => {
    if (e.target.dataset.index) {
        e.target.src = "images/radio_button_unchecked_black_24dp.svg";
    }
});

projectsListContainer.addEventListener("click", (e) => {
    clearContainer(toDoListContainer);
    for (let i = 0; i < itemStorage.length; i++) {
        if (projectStorage[e.target.id] === itemStorage[i].project) {
            displayItem(i, toDoListContainer)
        }
    }
})

buttonInbox.addEventListener("click", () => {
    displayInboxItems();
});

buttonToday.addEventListener("click", () => {
    displayTodayItems();
});

buttonWeek.addEventListener("click", () => {
    displayThisWeekItems();
});

// test items
const test = Item("This is an overdue item", "desc", new Date(2021, 11, 15), 0, "Bish");
const test1 = Item("This is a today item", "it is also IMPORTANT", startOfToday(), 2, "Bash");
const test2 = Item("This is a future item", "it is also URGENT and IMPORTANT", new Date(2021, 12, 31), 4, "Bosh");
const test3 = Item("This is a test item", "a description", new Date(2021, 11, 14), 3, "Bish");
const test4 = Item("This is a test item", "also a description", new Date(2021, 12, 126), 1, "Bash");
const test5 = Item("This is a test item", "another description", startOfToday(), 1, "Bosh");

addItem(test);
addItem(test1);
addItem(test2);
addItem(test3);
addItem(test4);
addItem(test5);

let newTitle = document.getElementById("new-title");
let newDescription = document.getElementById("new-description");
let newDueDate = document.getElementById("new-due-date");
let newPriority = document.getElementById("new-priority");
let newProject = document.getElementById("new-project");

// on load
sortItemsByDate();
cacheDates();
cacheProjects();
loadProjectsSideBar();
loadProjectsDropDown();
displayInboxItems();


function loadProjectsDropDown() {
    for (let i = 0; i < projectStorage.length; i++) {
        let temp = document.createElement("option")
        temp.setAttribute("value", `${projectStorage[i]}`)
        temp.textContent = `${projectStorage[i]}`
        newProject.appendChild(temp)
    }
}

function clearContainer(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function displayItem(i, parentElement) {
    let cell = document.createElement("div");
    cell.className = "cell";

    let checkbox = document.createElement("img");
    checkbox.src = "images/radio_button_unchecked_black_48dp.svg";
    checkbox.setAttribute("data-index", `${i}`);
    checkbox.className = "cell__checkbox";
    cell.appendChild(checkbox);

    let title = document.createElement("h2");
    title.className = "cell__title";
    title.textContent = itemStorage[i].title;
    cell.appendChild(title);

    let description = document.createElement("p");
    description.className = "cell__description";
    description.textContent = itemStorage[i].description;
    cell.appendChild(description);

    switch (itemStorage[i].priority) {
        case 0 || 1:
            cell.classList.add("NotUrgentNotImportant");
            break;
        case 2:
            cell.classList.add("NotUrgentImportant");
            break;
        case 3:
            cell.classList.add("UrgentNotImportant");
            break;
        case 4:
            cell.classList.add("UrgentImportant");
            break;
    }
    parentElement.appendChild(cell);
}

function displayInboxItems() {
    clearContainer(toDoListContainer);
    loadDates();
    for (let i = 0; i < itemStorage.length; i++) {
        for (let j = 0; j < dateStorage.length; j++) {
            let temp = document.querySelector(`[data-date-index = "${j}"]`)
            if(isEqual(itemStorage[i].dueDate, Date.parse(temp.dataset.date))) {
                displayItem(i, temp);
            }
        }
    }
}

function displayTodayItems() {
    clearContainer(toDoListContainer);
    for (let i = 0; i < itemStorage.length; i++) {
            if(isToday(itemStorage[i].dueDate)) {
                displayItem(i, toDoListContainer);
            }
    }
}

function displayThisWeekItems() {
    clearContainer(toDoListContainer);
    for (let i = 0; i < itemStorage.length; i++) {
            if(isBefore(itemStorage[i].dueDate, (add(itemStorage[i].dueDate, {days: 7}))) && isAfter(itemStorage[i].dueDate, endOfYesterday())) {
                displayItem(i, toDoListContainer);
            }
    }
}



function newItem() {
    let newItem = Item(newTitle.value, newDescription.value, newDueDate.valueAsDate, parseInt(newPriority.value), newProject.value);
    addItem(newItem);
    sortItemsByDate();
    cacheDates();
    cacheProjects();
    loadProjectsSideBar();
    loadProjectsDropDown();
    displayInboxItems();
}

function loadProjectsSideBar() {
    clearContainer(projectsListContainer);
    for (let i = 0; i < projectStorage.length; i++) {
        let temp = document.createElement("button");
        temp.id = i;
        temp.className = "side-bar__list-item";
        temp.textContent = `${projectStorage[i]}`;
        projectsListContainer.appendChild(temp);
    }
}

function loadDates() {
    let overdueContainer = document.createElement("div");
    overdueContainer.className = "todolist__period todolist__period--red-outline"
    let overdue = document.createElement("h2");
    overdue.className = "todolist__period-label"
    overdueContainer.appendChild(overdue);
    toDoListContainer.appendChild(overdueContainer);

    let todayContainer = document.createElement("div");
    todayContainer.className = "todolist__period todolist__period--green-outline"
    let today = document.createElement("h2");
    today.className = "todolist__period-label"
    todayContainer.appendChild(today);
    toDoListContainer.appendChild(todayContainer);

    let upcomingContainer = document.createElement("div");
    upcomingContainer.className = "todolist__period"
    let upcoming = document.createElement("h2");
    upcoming.className = "todolist__period-label"
    upcomingContainer.appendChild(upcoming);
    toDoListContainer.appendChild(upcomingContainer);

    for (let i = 0; i < dateStorage.length; i++) {

        let dateContainer = document.createElement("div");
        let date = document.createElement("h3");
        
        dateContainer.dataset.dateIndex = i;
        dateContainer.dataset.date = dateStorage[i];
        dateContainer.className = "todolist__day";
        
        if (isToday(Date.parse(dateStorage[i]))) {
            today.textContent = "Today";
            todayContainer.appendChild(dateContainer);
        }
        else if (isPast(Date.parse(dateStorage[i]))) {
            overdue.textContent = "Overdue";
            date.textContent = `${differenceInCalendarDays(startOfToday(), Date.parse(dateStorage[i]))} day/s ago`;
            date.className = "todolist__date";
            dateContainer.appendChild(date);
            overdueContainer.appendChild(dateContainer);
        }
        else {
            upcoming.textContent = "Upcoming"
            date.textContent = `${format(Date.parse((dateStorage[i])), 'EEE, dd LLL')}`;
            date.className = "todolist__date";
            dateContainer.appendChild(date);
            upcomingContainer.appendChild(dateContainer);
        }
    }
}

function diagnose() {
    console.table(itemStorage);
    console.table(projectStorage);
    console.table(dateStorage);
}

export { diagnose }