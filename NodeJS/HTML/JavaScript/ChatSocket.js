let socket = null;


function serverConnect(){
    socket = io();
    createChatRoom();
    // 채팅방이 존재하면 채팅 로그 가져옴
    socket.on('chatData', (chatData) => {
        console.log('받은 채팅 데이터:', chatData);
        createChatLog(chatData);
    });
}
function createChatLog(chatData){
    const chatLogContainer = document.getElementById('chatLogContainer');
    let messageElement = "";

    getUserSession().then(type => {
        for(let i = 0; i < chatData.length; i++){
            console.log(type.userId == chatData[i].fromUser);
            if(type.userId == chatData[i].fromUser){
                messageElement += `<div class='rightMsg'>
                                        <span class='chatStyle'>${chatData[i].content}</span>
                                    </div>`;
            }
            else{
                messageElement += `<div class='leftMsg'>
                                        <p style='margin:0; margin-left: 50px; margin-bottom: -5px;'>${chatData[i].fromUser}</p>
                                        <div id='leftMsgDiv'>`;
                if(type.userType == "user"){
                    messageElement += `<img src='${chatData[i].expert_route}' id='chatProfile' />`;
                }
                else{
                    messageElement += `<img src='https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927' id='chatProfile' />`;
                }
                messageElement += `<span class='chatStyle'>${chatData[i].content}</span>
                                    </div>
                                </div>`;           
            }
        }
        chatLogContainer.innerHTML = messageElement;
        scrollToBottom();
    });
}
//엔터를 누르면 버튼 작동
function handleKeyPress(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("sendBtn").click();
    }
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

let isChatMessageListenerRegistered = false;

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

    registerChatMessageListener(); // 리스너 등록 함수 호출
}

function registerChatMessageListener() {
    if (!isChatMessageListenerRegistered) {
        socket.on('chat message', (messageObject) => {
            const { fromUser, message } = messageObject;
            let messageElement = "";
            getUserSession().then(type => {
                if(type.userId == fromUser){
                    messageElement += `<div class='rightMsg'>
                                            <span class='chatStyle'>${message}</span>
                                        </div>`;
                }
                else{
                    messageElement += `<div class='leftMsg'>
                                            <p style='margin:0; margin-left: 50px; margin-bottom: -5px;'>${fromUser}</p>
                                            <div id='leftMsgDiv'>`;
                    if(type.userType == "user"){
                        messageElement += `<img src='#' id='chatProfile' />`;
                    }
                    else{
                        messageElement += `<img src='https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927' id='chatProfile' />`;
                    }
                    messageElement += `<span class='chatStyle'>${message}</span>
                                        </div>
                                    </div>`;           
                }
                appendMessage(messageElement);
            });
        });
        isChatMessageListenerRegistered = true;
    }
}

function socketChat(expertId, userId) {
    console.log("소켓챗 함수 호출");

    console.log(expertId, userId);

    window.open(`Chating.html?expertId=${expertId}&userId=${userId}`, 'ChatPopup', 'width=585, height=900');
    //location.href = `Chating.html?expertId=${expertId}&userId=${userId}`;
}

function appendMessage(message) {
    const chatLogContainer = document.getElementById('chatLogContainer');
    chatLogContainer.innerHTML += `${message}`;
    // console.log(message);
    // const messages = document.getElementById('messages');
    // const li = document.createElement('li');
    // li.textContent = message;
    // messages.appendChild(li);
    scrollToBottom();
}


function scrollToBottom() {
    const scrollableContent = document.getElementById('chatLogContainer');
    
    scrollableContent.scrollTop = scrollableContent.scrollHeight;
    scrollableContent.addEventListener('scroll', (event) => {
        console.log(`scrollTop: ${scrollableContent.scrollTop}`);
    });
}

