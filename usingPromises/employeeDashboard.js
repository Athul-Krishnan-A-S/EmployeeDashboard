let existingData = [];

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
    const day = dob.getDate().toString().padStart(2,'0');
    const month = (dob.getMonth() + 1).toString().padStart(2,'0');
    const year = dob.getFullYear().toString();
    const DateOfBirth = day+"/"+month+"/"+year;
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
    const btn = document.getElementById('editAddbtn');
    btn.innerHTML = 'ADD USER';
    modal.classList.remove('hidden');

    document.getElementById('modal-nameField').value = "";
    document.getElementById('modal-designationField').value = "";
    document.getElementById('modal-dateField').value = "";
    document.getElementById('modal-dateField').removeAttribute('type');
    document.getElementById('modal-dateField').setAttribute('type','date');
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

    const btn = document.getElementById('editAddbtn');
    btn.innerHTML = 'SAVE';

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


                existingData.push(data);
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
    if(existingData[0].name !== name || existingData[0].designation !== designation || existingData[0].dob !== dob){
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
                    existingData = [];
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
    }else{
        closeModal(event);
    }

}

function deleteUser(id){
    const url = `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`;

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
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
      });

    
}

function submitForm(event){
    event.preventDefault();
    console.log("hi")
    const modal = document.getElementById('modal');
    let name = document.getElementById('modal-nameField');
    let designation = document.getElementById('modal-designationField');
    let dob = document.getElementById('modal-dateField');

    const nameRegex = /^(?! )(?!.* {2})[a-zA-Z]+$/;
    const dobRegex = /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
    if(nameRegex.test(name.value)&& dobRegex.test(dob.value)){
        modal.classList.add('hidden');
        storeData(name.value,designation.value,dob.value);
    }else if(!nameRegex.test(name.value)){
        name.focus();
        alert("enter a valid name");
    }else if(!dobRegex.test(dob.value)){
        dob.focus();
        alert("enter a valid dob");
    } 
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