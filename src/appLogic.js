let itemStorage = [];
let projectStorage = [];
let dateStorage = {};

function Item(title, description, dueDate, priority, project) {
    return{
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        project: project
    }
}

function addItem(item) {
    itemStorage.push(item);
}

function removeItem(itemIndex) {
    itemStorage.splice(itemIndex, 1)
}

function cacheDates() {
    let temp = itemStorage.reduce((obj, item) => {
        if(!obj[item.dueDate]) {
            obj[item.dueDate] = 0;
        }
        obj[item.dueDate]++;
        return obj;
    }, {});
    dateStorage = Object.getOwnPropertyNames(temp);
}

function sortItemsByDate() {
    itemStorage.sort((a, b) => {
        return a.dueDate > b.dueDate ? 1 : -1;
    })
}

function cacheProjects() {
    for (let i = 0; i < itemStorage.length; i++) {
        if (projectStorage.indexOf(itemStorage[i].project) === -1) {
            projectStorage.push(itemStorage[i].project)
        }
    }
}

export {
    itemStorage,
    projectStorage,
    dateStorage,
    Item,
    addItem,
    removeItem,
    cacheDates,
    sortItemsByDate,
    cacheProjects
}