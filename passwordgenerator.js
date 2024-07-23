const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols  = '~`!@#$%^&*_-+\|:;<>,.?/';

let password = "";
let passwordlength = 10;
let checkcount = 1;
handleslider();


//set password length
function handleslider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
}
function setindicator(color){
    indicator.style.backgroundColor = color;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCases(){
    return String.fromCharCode(getRandomInteger(97,122));
}
function generateUpperCases(){
    return String.fromCharCode(getRandomInteger(65,90));
}
function generateSymbol(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt[randNum];
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let syb = false;
    let hasNum = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) syb= true;

    if(hasUpper &&  hasLower && (hasNum || syb) && passwordlength>=8){
        setindicator("#0f0");
    }
    else if((hasUpper||hasLower) && (hasNum || syb)&& passwordlength>=6 ){
        setindicator("#ff0");
    }
    else{
        setindicator("f00");
    }
}

async function copycontent(){
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";   
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.add("active");
    }, 2000);
}

 
inputSlider.addEventListener('input',(e)=>{
    passwordlength = e.target.value;
    handleslider();
}); 
copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copycontent();
    }
});
function handleCheckBoxChange(){
    checkcount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)checkcount++;
    });

    //special condition
    if(passwordlength<checkcount){
        passwordlength= checkcount;
        handleslider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})


function sufflePassword(array){
    //fisher yate method

    for(let i = Array.length-1;i>0; i--){
            const j = Math.floor(Math.random()*(i+1));
            const temp = array[i];
            array[i] =array[j];
            array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str+=el));
    return str;
}
generateBtn.addEventListener('click',()=>{

    //none of checkbox is selected
    if(checkcount<=0) return;

    if(passwordlength<checkcount){
        passwordlength =checkcount;
        handleslider();
    }

    //let start the journey to find new password
    //remove old password
    password="";
   
    let funcArr = [];
     if(uppercaseCheck.checked){
        funcArr.push(generateUpperCases);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCases);
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    //for compulsory addition
    for(let i =0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    // remaining addition
    for(let i = 0;i<passwordlength-funcArr.length; i++){
        let randomIndex = getRandomInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }

    //suffle the password
    password = sufflePassword(Array.from(password));

    //show in Display or UI
    passwordDisplay.value = password;

    //calcultate strength
    calcStrength(); 




});
