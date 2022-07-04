const create_user = 'http://dummy.restapiexample.com/api/v1/create';
const get_all_users = 'http://dummy.restapiexample.com/api/v1/employees';
const get_user = 'http://dummy.restapiexample.com/api/v1/employee/';


const api_getAllEmployees = () => {
    return fetch(get_all_users);
}

const api_getEmployee = (id) => {
    return fetch(get_user + id)
}
const api_addNewEmployee = (jsonData) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return fetch(create_user,{
        method:'Post',
        body: JSON.stringify(jsonData)
    })
}


window.onload = () => {
    const table = document.querySelector('#usersTable').getElementsByTagName('tbody')[0];
    const searchButton = document.querySelector('#searchButton');
    const searchQuery = document.querySelector('#searchQuery');
    const addForm = document.querySelector('#addForm');
    const spinner = document.querySelector('#spinner');
    const newItemId = document.querySelector('#newItemId');


    const addNewRow = (c1, c2, c3, c4) => {
        // add new item to the table rows
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.innerHTML=c1;
        cell2.innerHTML=c2;
        cell3.innerHTML=c3;
        cell4.innerHTML=c4;
    }

    const loadAll = () => {
        // load all the employees
        api_getAllEmployees().then(response => response.ok ? response.json(): console.log('error occured!')).catch(error => console.log('error!', error)).then(json => {
            json.data.forEach(user => addNewRow(user.id, user.employee_name, user.employee_age, user.employee_salary))
        });

    }

    const onFormSubmitted = (event) => {
        // send post request to the api and get the new item id
        event.preventDefault();
        const name = event.target[0].value;
        const salary = event.target[1].value;
        const age = event.target[2].value;

        spinner.classList.remove('d-none');
        newItemId.innerHTML = " ";

        api_addNewEmployee({name, age, salary}).then(res => res.json()).then(json => {
            newItemId.innerHTML="Done. #" + json.data.id;
            addForm.reset();
            spinner.classList.add('d-none');

        })

    }

    loadAll();

    addForm.addEventListener('submit', onFormSubmitted);

    searchButton.onclick = () => {

        table.innerHTML = '';
        if (searchQuery.value) {
            // fetch one item from api 
            api_getEmployee(searchQuery.value).then(response => response.json()).then(json => addNewRow(json.data.id, json.data.employee_name, json.data.employee_age, json.data.employee_salary))
        } else {
            loadAll();
        }

    }

}

