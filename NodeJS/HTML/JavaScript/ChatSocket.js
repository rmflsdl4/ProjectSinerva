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

    // 방에 참가
    const room = expertId + userId;
    if(socket !== null){
        let info = [userId, expertId, room];
        socket.emit('join', info);
        setChating(expertId, room);
    }
    else{
        serverConnect();
        console.log("소켓이 없음!");
    }
}
function setChating(expertId, room){
    const form = document.getElementById('chat-form');
    const input = document.getElementById('message-input');
    console.log("방 정보",expertId, room);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = input.value;
        if (msg.trim() !== '') {
        const messageObject = {
            userId: expertId,  // 실제로 사용자 아이디를 어떻게 처리할지 정의해야 합니다.
            message: msg,
        };
        socket.emit('chat message', messageObject, room);
        input.value = '';
        }
    });
    socket.on('chat message2', (messageObject) => {
        const { userId, message } = messageObject;
        appendMessage(`(${userId}): ${message}`);
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