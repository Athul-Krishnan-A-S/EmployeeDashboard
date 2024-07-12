
document.addEventListener('DOMContentLoaded',function(){
    fetchData();
});

async function fetchData(){
    const url = "https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee";
    try{
        const response = await fetch(url);
        const employeeDetails = await response.json();
        displayData(employeeDetails);
    }catch (error){
        alert(error);
    }
}

function displayData(data){
    const parentDiv = document.getElementById('parentDiv');
    parentDiv.innerHTML = '';


   data.forEach((obj,index) => {
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

async function editUser(id){

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

    try{
        const response = await fetch(url);
        const data = await response.json();

        name.value = data.name;
        designation.value = data.designation;
        dob.value = new Date(data.dob).toLocaleDateString('en-US');
    }catch(error){
        alert(error);
    }
}

async function updateUserDetails(id,event){
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    event.preventDefault();
    const url = `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`;
    let name = document.getElementById('modal-nameField').value;
    let designation = document.getElementById('modal-designationField').value;
    let dob = document.getElementById('modal-dateField').value;
    const data = {name,designation,dob};
    try{
        const response = await fetch(url,{
            method:'PUT',
            headers:{
                'Accept':'Application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        });
        if(!response.ok){
            alert('error');
        }
        fetchData();
    }
    catch(error){
        alert(error);
    }
}

 async function deleteUser(id){
    const url = `https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee/${id}`;
    try{
        const data = await fetch(url,{
            method:'DELETE',
            headers:{
                'Accept':'Application/json'
            }
        });
        if(!data.ok){
            alert('failed');
        }
        fetchData();
    }
    catch(error){
        alert(error);
    }
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

async function storeData(name,designation,dob){
    const url = "https://6580190d6ae0629a3f54561f.mockapi.io/api/v1/employee";
    const data = {name,designation,dob};
    try{
        const employeeDetails = await fetch(url,{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data),
            cache:'default'
        })
        fetchData();
    }catch(error){
        alert(error);
    }
    
    
}