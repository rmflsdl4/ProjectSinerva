var currPageNum;
let posts; 
let prePage;
let nextPage;
var pageCount;
var pageNum;

function InitPage(){
    currPageNum = 1;

    posts = document.getElementsByClassName("commentRequest");
    prePage = document.getElementById("prePage");
    nextPage = document.getElementById("nextPage");
    pageNum = document.getElementById("pageNum");
    pageCount = Math.round(posts.length / 5);

    prePage.style.display = "none";
    PageLoad();
}
function SetPost(){
    for(let i = 0; i < posts.length; i++){
        posts[i].style.display = "none";
    }
}
function PageLoad(){
    SetPost();
    var startPageNum;
    if(currPageNum == 1){
        startPageNum = 0;
    }
    else{
        startPageNum = (currPageNum - 1) * 5;
    }
    for(let i = startPageNum; i < currPageNum * 5; i++){
        posts[i].style.display = "";
    }
}
function SetPreNum(){
    if(currPageNum > 1){
        currPageNum -= 1;
        PageLoad();
        SetCurrentPageText();
        
        prePage.style.display = "block";
    }
    else{
        prePage.style.display = "none";
        nextPage.style.display = "block";
    }
}
function SetNextNum(){
    if(pageCount > currPageNum){
        currPageNum += 1;
        PageLoad();
        SetCurrentPageText();
        nextPage.style.display = "block";
    }
    else{
        prePage.style.display = "block";
        nextPage.style.display = "none";
    }
}
function SetCurrentPageText(){
    pageNum.textContent = currPageNum;
}
