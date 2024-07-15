
document.addEventListener('DOMContentLoaded',function(){
    fetchData()
        	.then(data => {
                displayData(data);
            })
            .catch(error => {
                console.error(error);
            })
});

function fetchData(){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            const url = "https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee";
            fetch(url)
                .then(response => {
                    if(!response.ok){
                        throw new Error('api connexctivity error');
                    }else{
                        return(response.json());
                    }
                })
                .then(data => {
                    displayData(data);
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    })
}

function displayData(data){
    const parentDiv = document.getElementById('parentDiv');
    parentDiv.innerHTML = '';


   data.forEach((obj) => {
    const div = document.createElement('div');
    div.setAttribute('class','data');

    const nameField = document.createElement('input');
    nameField.value = obj.name;
    nameField.setAttribute('disabled','');
    nameField.setAttribute('class','field');
    nameField.classList.add('editableFields');
    div.appendChild(nameField);

    const designationField = document.createElement('input');
    designationField.value = obj.designation;
    designationField.setAttribute('disabled','');
    designationField.setAttribute('class','field');
    designationField.classList.add('editableFields');
    div.appendChild(designationField);

    const dob = new Date(obj.dob);
    const DateOfBirth = dob.toLocaleDateString('en-US');
    const dateOfBirthField = document.createElement('input');
    dateOfBirthField.value = DateOfBirth;
    dateOfBirthField.setAttribute('disabled','');
    dateOfBirthField.setAttribute('class','field');
    dateOfBirthField.classList.add('editableFields');
    div.appendChild(dateOfBirthField);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.setAttribute('class','buttons');

    const editBtn = document.createElement('button');
    editBtn.setAttribute('class','btn');
    editBtn.textContent = 'EDIT';
    editBtn.setAttribute('onclick',`editUser(${obj.id})`);
    buttonsContainer.appendChild(editBtn);


    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class','btn');
    deleteBtn.textContent = 'DELETE';
    deleteBtn.setAttribute('onclick',`deleteUser(${obj.id})`);
    buttonsContainer.appendChild(deleteBtn);

    div.appendChild(buttonsContainer);
    parentDiv.appendChild(div)
   })
}


function addUser(){
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
}

function editUser(id){

    const url = `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`;

    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');

    const modalForm = document.getElementById('modalForm');
    modalForm.removeAttribute('onsubmit');
    modalForm.setAttribute('onsubmit',`updateUserDetails(${id},event)`);
    
    const name = document.getElementById('modal-nameField');
    const designation = document.getElementById('modal-designationField');
    const dob = document.getElementById('modal-dateField');

    dob.removeAttribute('type');
    dob.setAttribute('type','text');

    return new Promise((resolve,reject) => {
        fetch (url)
            .then(response => {
                if(!response.ok){
                    throw new Error('connnection error');
                }else{
                    return response.json();
                }
            })
            .then(data => {
                name.value = data.name;
                designation.value = data.designation;
                dob.value = new Date(data.dob).toLocaleDateString('en-US');
                resolve(data);
            })
            .catch(error => {
                reject(error);
            })
    })    
        
}

function updateUserDetails(id,event){
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    event.preventDefault();
    const url = `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`;
    let name = document.getElementById('modal-nameField').value;
    let designation = document.getElementById('modal-designationField').value;
    let dob = document.getElementById('modal-dateField').value;
    const data = {name,designation,dob};
    
    return new Promise((resolve,reject) => {
        fetch(url,{
            method:'PUT',
            headers:{
                'Accept':'Application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(response => {
            if(!response.ok){
                throw new Error('connection error');
            }else{
                return response.json();
            }
        })
        .then(data => {
            fetchData();
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    })
}

function deleteUser(id){
    const url = `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`;

    return new Promise((resolve,reject) => {
        fetch(url,{
            method:'DELETE',
            headers:{
                'Accept':'Application/json'
            }
        })
        .then(response => {
            if(!response.ok){
                throw new Error('connectivity error');
            }else{
                return response.json();
            }
        })
        .then(data => {
            fetchData();
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    }) 
}

function submitForm(event){
    event.preventDefault();
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    let name = document.getElementById('modal-nameField').value;
    let designation = document.getElementById('modal-designationField').value;
    let dob = document.getElementById('modal-dateField').value;

    storeData(name,designation,dob);
}

function storeData(name,designation,dob){
    const url = "https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee";
    const data = {name,designation,dob};
    return new Promise((resolve,reject) => {
        fetch(url,{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
            cache:'default'
        })
        .then(response => {
            if(!response.ok){
                throw new Error('connection error');
            }else{
                return response.json();
            }
        })
        .then(data => {
            fetchData();
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    })       
}

function closeModal(event){
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    event.preventDefault();
}