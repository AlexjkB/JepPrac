//variables
var question = "";
var answer = "";
var year = "";
var value = 0;
var category = "";
var total = 0;

window.onload = init;

function init(){
//shortcuts
    document.getElementById("input_answer").addEventListener("keypress", function(event) {
        if(event.key === "Enter"){
            event.preventDefault();
            checkAnswer();
        }
    });
    document.getElementById("total").innerText = total;
}

function updateClue() {
    document.getElementById("question").innerText = question;
    document.getElementById("answer").innerText = answer;
    document.getElementById("year").innerText = year;
    document.getElementById("value").innerText = value;
    document.getElementById("category").innerText = category;
    console.log("got clue");
}

async function getClue(){  
    const post = await fetch("https://free-jep-api.fly.dev/random").then((res) => res.json());
    question = post.clue_question;
    answer = post.clue_answer;
    year = post.game_year;
    category = post.clue_category;
    let string_value = post.clue_value;
    if (string_value == "DD"){
        value = 2000;
    } else {
        string_value = string_value.replace('$', '');
        value = parseInt(string_value);
    }
    updateClue();
}

function checkAnswer(){
    console.log("checking answer");
    let input_answer = document.getElementById("input_answer").value;
    if(input_answer == answer){
        total += value;
    } else {
        total -= value;
    }
    getClue();
    document.getElementById("total").innerText = total;
}

