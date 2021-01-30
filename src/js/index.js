const loginButton = document.querySelector('.form__button');
const loginInput = document.querySelector('.form__name');
const nickNameInput = document.querySelector('.form__nickname');
const loginPage = document.querySelector('.login');
const loginError = document.querySelector('.error');
const closeButton = document.querySelector('.error__button');
const usersNumber = document.querySelector('.users__number');
const chatPage = document.querySelector('.chat');
const usersList = document.querySelector('.users__list');
const userNick = document.querySelector('.users__nick');
// const userTitle = document.querySelector('.users__name');
const chatScreen = document.querySelector('.messages__screen');
const messageWindow = document.querySelector('.messages__input');
const photo = document.querySelector('#user_avatar');
const photoLoading = document.querySelector('#upload-photo');
const addPhotoButton = document.querySelector('[data-role=add-photo]');
const uploadForm = document.querySelector('[data-role=upload-form]');
const fileReader = new FileReader();
const cancelButton = document.querySelector('[data-role=cancel-button]');
const chooseButton = document.querySelector('[data-role=choose-button]');
const uploadButton = document.querySelector('[data-role=upload-button]');
let usersListArray = 0;

let currentUser = {
  name: "",
  nick: "",
  photo: "./images/photo.jpeg",
  id: ""
}

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
      addNewMesssage(response.requestBody, response.name, response.photo, response.nick);
      break;
    case 'photoLoad':
      addPhotoToMessages(response.nick, response.photo)
      addPhotoToList (response.nick, response.photo)
      break;
    case 'allUsers':
      usersList.innerHTML = '';
      usersListArray = 0;

      response.body.forEach(user => {   
        if (user.online === true) {
          const el = addNewUser(user.name, user.nick);
          usersList.appendChild(el);
          usersListArray++;

        } if (user.online === false) {
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
  let time = (date.getHours()+":"+ (date.getMinutes()<10?'0':'')+ date.getMinutes());
  div.classList.add('messages__time');
  div.textContent = time;

  return div
}

function addNewUser(name, nick) {
  const item = document.createElement('li');
  item.dataset.nick = `${nick}`;
  const itemImage = document.createElement('img');
  const itemName = document.createElement('p');
  item.classList.add('users__item');
  itemImage.classList.add('avatar');
  itemImage.src = './images/photo.jpeg';
  itemName.classList.add('users__name');
  itemName.textContent = name;
  item.appendChild(itemImage)
  item.appendChild(itemName)

  return item;
}

function addNewNotification(name, state, userId) {
  const div = document.createElement('div');

  div.classList.add('messages__notification');
  if (state === true) {
    div.textContent = `${name} в чате`;
  } if (state === false) {
      
    div.textContent = `${name} вышел(а) из чата`;
  } 
  
  chatScreen.appendChild(div);

  scrollToEndPage()
}

function addNewMesssage(message, name, photo, nick) {
  const messageBlock = document.createElement('div');
  const contentBlock = document.createElement('div');
  const headingBlock = document.createElement('div');
  const image = document.createElement('img');
  const timeBlock = setTime();

  contentBlock.classList.add('messages__content');
  image.classList.add('avatar--small');
  image.src = photo;
  headingBlock.classList.add('messages__heading')
  contentBlock.textContent = message;
  messageBlock.classList.add('messages__text');
  messageBlock.dataset.nick = `${nick}`;
  messageBlock.appendChild(image);
  headingBlock.appendChild(contentBlock);
  headingBlock.appendChild(timeBlock);
  messageBlock.appendChild(headingBlock);
  chatScreen.appendChild(messageBlock);

  scrollToEndPage()
}

function addPhotoToMessages (nick, photo) {
  const allElement = chatScreen.children;
  
  for (const el of allElement) {
    if (el.classList == 'messages__text') {
      if (el.dataset.nick == nick) {
        const photoEl = el.firstChild;
        photoEl.src = photo;
      }
    }
  }
}

function addPhotoToList (nick, photo) {
  const allElements = usersList.children;
  
  for (const el of allElements) {
    if (el.dataset.nick == nick) {
      const photoEl = el.firstChild;
      photoEl.src = photo;
    }
  }
}


function scrollToEndPage() { 
  chatScreen.scrollTop = chatScreen.scrollHeight;
};

messageWindow.addEventListener('change', () => {
  const message = messageWindow.value;
  const name = currentUser.name;
  const nick = currentUser.nick;
  const photoLink = currentUser.photo;
  const request = {
    type: 'message',
    requestBody: message,
    name: name,
    photo: photoLink,
    nick: nick
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
    currentUser.name = userName;
    currentUser.nick = nickName;
  } else {
    loginError.style.display = "flex";
  }

})

//photo
fileReader.addEventListener('load', () => {
  
  photoLoading.src = fileReader.result;
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
  currentUser.photo = fileReader.result;
  const photoLink = fileReader.result;

  uploadForm.style.display = "none";

  const nick = currentUser.nick;
  const request = {
    type: 'photoLoad',
    photo: photoLink,
    nick: nick
  }

  ws.send(JSON.stringify(request));
})
