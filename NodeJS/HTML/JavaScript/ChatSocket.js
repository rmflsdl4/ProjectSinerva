let socket = null;


function serverConnect(){
    socket = io();
    createChatRoom();
}
function createChatRoom(){
    const urlParams = new URLSearchParams(window.location.search);

    // 쿼리 파라미터에서 expertId와 userId 가져오기
    const expertId = urlParams.get('expertId');
    const userId = urlParams.get('userId');

    // 가져온 값들을 콘솔에 출력하거나 필요한 작업 수행
    console.log('expertId:', expertId);
    console.log('userId:', userId);

    const sendBtn = document.getElementById('sendBtn');
    // 방에 참가
    const room = expertId + userId;
    sendBtn.addEventListener('click', ()=>{
        setChating(room);
    });
    if(socket !== null){
        let info = [userId, expertId, room];
        socket.emit('join', info);
    }
    else{
        serverConnect();
        console.log("소켓이 없음!");
    }
}
async function getUserSession() {
    return await new Promise((resolve, reject) => {
        fetch('/login-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function setChating(room){
    const input = document.getElementById('message-input');
    console.log("방 정보", room);
    getUserSession().then(type => {
        const msg = input.value;
        if (msg.trim() !== '') {
        const messageObject = {
            fromUser: type.userId,
            message: msg,
        };
        socket.emit('chat message', messageObject, room);
        input.value = '';
        }
    });
    socket.on('chat message2', (messageObject) => {
        const { fromUser, message } = messageObject;
        appendMessage(`(${fromUser}): ${message}`);
    });
}
function socketChat(expertId, userId) {
    console.log("소켓챗 함수 호출");

    console.log(expertId, userId);

    
    location.href = `Chating.html?expertId=${expertId}&userId=${userId}`;
}

function appendMessage(message) {
    const messages = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = message;
    messages.appendChild(li);
}