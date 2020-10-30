const loginButton = document.querySelector('.login__button');
const loginInput = document.querySelector('.login__name');
const nickNameInput = document.querySelector('.login__nickName');
const loginPage = document.querySelector('.login');
const chatPage = document.querySelector('.chat');
const usersList = document.querySelector('.chat__users-list');
const chatScreen = document.querySelector('.chat__messages-screen');
const messageWindow = document.querySelector('.chat__messages-new');
const userNick = document.querySelector('.chat__messages-name');
const userTitle = document.querySelector('.chat__users-name');
const loginError = document.querySelector('.login__error');
const closeButton = document.querySelector('.close-button');
const usersNumber = document.querySelector('.chat__users-number');
const photo = document.querySelector('#user_avatar');
const photoLoading = document.querySelector('#upload-photo');
const addPhotoButton = document.querySelector('[data-role=add-photo]');
const uploadForm = document.querySelector('[data-role=upload-form]');
const fileReader = new FileReader();
const cancelButton = document.querySelector('[data-role=cancel-button]');
const chooseButton = document.querySelector('[data-role=choose-button]');
const uploadButton = document.querySelector('[data-role=upload-button]');
let usersListArray = 0;

//server//
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function () {
  console.log('client connect');
}

ws.onclose = function () {
  console.log('client disconnect');
}

ws.onerror = function (err) {
  console.log(err);
}

ws.onmessage = function(event) {
  const response = JSON.parse(event.data);
  
  switch (response.type) {
    case 'loginName':
      addNewNotification(response.name, true, response.id);
      break;
    case 'message':
      console.log(response)
      addNewMesssage(response.requestBody, response.name, response.photo);
      break;
    case 'allUsers':
      usersList.innerHTML = '';
      usersListArray = 0;

      response.body.forEach(user => {   
        //console.log(user.online)   
        if (user.online === true) {
          const el = addNewUser(user.name);
          usersList.appendChild(el);
          usersListArray++;
          console.log(true)

        } if (user.online === false) {
          console.log(false)
          addNewNotification(user.name, false, user.id);

          const deleteRequest = {
            type: 'userDelete',
            name: name,
            id: user.id
          }
      
          ws.send(JSON.stringify(deleteRequest));
        } if  (user.online === 'undefined') {
          console.log("no such user")
        }
      })
      let usersTotal = String(usersListArray);
      usersNumber.textContent = usersTotal;
      break;
    default: console.error('Unknown response type')
      break;
  }
}

//chat

function setTime() {
  const date = new Date();
  const div = document.createElement('div');
  let time = (date.getHours()+":"+date.getMinutes());
  div.classList.add('chat__messages-time');
  div.textContent = time;

  return div
}

function addNewUser(name) {
  const item = document.createElement('li');
  item.classList.add('chat__users-item');
  item.textContent = name;

  return item;
}

function addNewNotification(name, state, userId) {
  const div = document.createElement('div');

  div.classList.add('chat__messages-notification');
  if (state === true) {
    div.textContent = `${name} в чате`;
  } if (state === false) {
      
    div.textContent = `${name} вышел(а) из чата`;
    
  } 
  
  chatScreen.appendChild(div);
}

function addNewMesssage(message, name, photo) {
  const messageBlock = document.createElement('div');
  const contentBlock = document.createElement('div');
  const headingBlock = document.createElement('div');
  const nameBlock = document.createElement('div');
  const image = document.createElement('img');
  const timeBlock = setTime();

  contentBlock.classList.add('chat__messages-content');
  image.classList.add('avatar--small');
  image.src = photo;
  headingBlock.classList.add('chat__messages-heading')
  contentBlock.textContent = message;
  nameBlock.classList.add('chat__messages-name');
  nameBlock.textContent = `${name}:`;
  messageBlock.classList.add('chat__messages-text');
  
  headingBlock.appendChild(image);
  headingBlock.appendChild(timeBlock);
  headingBlock.appendChild(nameBlock);
  messageBlock.appendChild(headingBlock);
  messageBlock.appendChild(contentBlock);
  chatScreen.appendChild(messageBlock);
}

messageWindow.addEventListener('change', () => {
  
  const message = messageWindow.value;
  const name = userTitle.textContent;
  const photoLink = photo.src;
  const request = {
    type: 'message',
    requestBody: message,
    name: name,
    photo: photoLink
  }

  ws.send(JSON.stringify(request));

  messageWindow.value = '';
})

closeButton.addEventListener('click', () => {
  loginError.style.display = "none";
})

loginButton.addEventListener('click',() => {
  const userName = loginInput.value.trim();
  const nickName = nickNameInput.value.trim();

  if (userName, nickName) {
    const request = {
      type: 'loginName',
      name: userName,
      nick: nickName
    }

    ws.send(JSON.stringify(request));
    loginPage.style.display = "none";
    chatPage.style.display = "flex";
    userTitle.textContent = userName;
  } else {
    loginError.style.display = "flex";
  }

})

//photo
fileReader.addEventListener('load', () => {
  
  photoLoading.src = fileReader.result;
})

addPhotoButton.addEventListener('click', (e) => {
 
})

addPhotoButton.addEventListener('click', () => {
  uploadForm.style.display = "flex";
})

cancelButton.addEventListener('click', () => {
  uploadForm.style.display = "none";
})

chooseButton.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (file) {
    if (file.size > 300 * 1024) {
      alert ('Файл  слишком большой')
    } else {
      fileReader.readAsDataURL(file);
    }
  }
})

uploadButton.addEventListener('click', () => {
  photo.src = fileReader.result;
  uploadForm.style.display = "none";
  
})


