const API_URL = 'http://api.quotable.io/random?minLength=100&maxLenght=620';

const typingContent=document.querySelector('.typingContent');
const input=document.querySelector('#txt');
const timerLabel=document.querySelector('.timer');

let duration=60;

let timer,count;

let error=0; 
let totalWords=0;
let result=false;
let fetchedQuote="";
let charIndex=0;
let num_of_char=0;



duration=Number(prompt("Enter the number of seconds you want to type:",60));
duration=duration===0?60:duration;

count=duration;


document.querySelector('.timer').innerHTML=`${duration} s`;
const rbtn=document.querySelector('.rbtn');
const reportDiv=document.querySelector('.displayReportDiv');

function reType(){
    window.location.reload();
}

function displayResult(wpm,cpm,typedWords,totalWords,incorrectWord,error,total_chars,total_typed_chars){
    
    let innerContent=`<h2>Result 📝</h2>
    <div class="content">
        <div class="content-data">Word Per Minute&nbsp;&nbsp;:&nbsp;&nbsp;${wpm}</div>
        <div class="content-data">Typed Words&nbsp;&nbsp;:&nbsp;&nbsp;${typedWords}</div>
        <div class="content-data">Incorrect Words&nbsp;&nbsp;:&nbsp;&nbsp;${incorrectWord}</div>
        <div class="content-data">Total Words&nbsp;&nbsp;:&nbsp;&nbsp;${totalWords}</div>
        <br>
        <hr>
        <br>
        <div class="content-data">Mistakes&nbsp;&nbsp;:&nbsp;&nbsp;${error}</div>
        <div class="content-data">Character Per Minute&nbsp;&nbsp;:&nbsp;&nbsp;${cpm}</div>
        <div class="content-data">Typed Characters&nbsp;&nbsp;:&nbsp;&nbsp;${total_typed_chars}</div>
        <div class="content-data">Total Characters&nbsp;&nbsp;:&nbsp;&nbsp;${total_chars}</div>
    </div>
    <div class="restartBtnDiv">
        <button class="rbtn">try again<i class="fa-solid fa-arrows-rotate ricon"></i></button>
    </div>`;

    reportDiv.innerHTML=innerContent;
    reportDiv.style.display='block';

    document.querySelector('.restartBtnDiv button.rbtn').addEventListener('click',reType);

}


async function renderNewQuote() {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    
    let fetchedData = data.content;
    fetchedQuote=data.content;
    totalWords=fetchedData.split(' ').length;


    fetchedData.split('').forEach(char => {    
        typingContent.innerHTML+=`<span class="chars">${char}</span>`;
    });

}

function checkWord(){
    let allChars=document.querySelectorAll('.chars');

    result=true;

    let incorrectWord=0;
    let typedWords=0;
    let flag=false;

    allChars.forEach(char => {
        if(char.classList.contains('incorrect') && flag===false){
            incorrectWord++;
            flag=true;
        }

        if(char.innerHTML==" "){
            flag=false;
        }
        
    });

    typedWords=fetchedQuote.substring(0,charIndex).split(' ').length;
    let total_typed_chars=fetchedQuote.substring(0,charIndex).split(' ').join('').length;
    let total_chars=fetchedQuote.split(' ').join('').length;

    if(fetchedQuote[charIndex]!==" "){
        --typedWords;
    }
    

    count=count===-1?0:count;
    
    
    let wpm=((typedWords-incorrectWord)*60)/(duration-count);
    let cpm=((total_typed_chars-error)*60)/(duration-count);
    
    
    wpm=Math.floor(wpm);
    cpm=Math.floor(cpm);
    console.log("wpm",wpm);
    console.log("cpm",cpm);
    
    console.log("typedWords",typedWords);
    console.log("totalWords",totalWords);
    console.log("incorrectWord",incorrectWord);
    console.log("error",error);
    console.log("total_chars",total_chars);
    console.log("total_typed_chars",total_typed_chars);
    
    displayResult(wpm,cpm,typedWords,totalWords,incorrectWord,error,total_chars,total_typed_chars);
}

document.addEventListener('click',()=>{
    input.focus()
})

//util

input.addEventListener('input', function(){
    let allChars=document.querySelectorAll('.chars');

    if(count===duration){
        timerLabel.innerHTML=count+" s";
        count--;    
        timer=setInterval(() => {
        
            timerLabel.innerHTML=count+" s";
            count--;

            if(count===0) {
                setTimeout(() => {
                    clearInterval(timer);
                    if(!result){
                        checkWord();
                    }
                },1000);
                
            }
    
        }, 1000);
    }
    

    allChars.forEach(char=>{
        char.style.border="unset";
    });
    
    let typedChar=input.value.split('')[charIndex];
   

    if(typedChar===undefined){

        charIndex--;
        num_of_char--;

        allChars[charIndex].style.backgroundColor="unset";

        if(allChars[charIndex].classList.contains('incorrect')){
            error--;
        }

        allChars[charIndex].classList.remove('correct','incorrect')
        if(charIndex===0){
            return
        }
        allChars[charIndex-1].style. borderRight='1px solid yellow';
        return
    }
    
    allChars[charIndex].style.borderRight='1px solid yellow';


    if(allChars[charIndex].innerHTML===typedChar){
        allChars[charIndex].style.backgroundColor="unset";
        allChars[charIndex].classList.add('correct');

    }else{
        allChars[charIndex].classList.add('incorrect');

        if(allChars[charIndex].innerHTML===" "){
            allChars[charIndex].style.backgroundColor="red";
        }

        error++;
    }

    

    charIndex++;


    if(allChars.length===charIndex){
        checkWord()
    }
    
    
});

renderNewQuote();







