const loginButton = document.querySelector('.login__button');
const loginInput = document.querySelector('.login__name');
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
const addPhotoButton = document.querySelector('[data-role=add-photo]');
const uploadForm = document.querySelector('[data-role=upload-form]');
const fileReader = new FileReader();
//const cancelButton = document.querySelector('[data-role=cancel-button]');
//const uploadButton = document.querySelector('[data-role=upload-button]');
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
      addNewUser(response.requestBody);
      addNewNotification(response.requestBody);
      break;
    case 'message':
      addNewMesssage(response.requestBody, response.name, response.photo);
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
  usersList.appendChild(item);
  usersListArray++;

  let usersTotal = String(usersListArray);
  usersNumber.textContent = usersTotal;
}

function addNewNotification(name) {
  const div = document.createElement('div');

  div.classList.add('chat__messages-notification');
  div.textContent = `${name} в чате`;
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
  const time = '12:00'
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

  if (userName) {
    const request = {
      type: 'loginName',
      requestBody: userName
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
  photo.src = fileReader.result;
})

addPhotoButton.addEventListener('change', (e) => {
  const file = e.target.files[0];

  if (file) {
    if (file.size > 300 * 1024) {
      alert ('Файл  слишком большой')
    } else {
      fileReader.readAsDataURL(file);
    }
  }
})

//addPhotoButton.addEventListener('click', () => {
//  uploadForm.style.display = "flex";
//})

//cancelButton.addEventListener('click', () => {
//  uploadForm.style.display = "none";
//})

//uploadButton.addEventListener('click', () => {
 // uploadForm.style.display = "none";
//})

