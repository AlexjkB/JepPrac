//variables
var question = "";
var answer = "";
var year = "";
var value = 0;
var category = "";
var total = 0;
var prevent_buzz = false;
var timer;

window.onload = init;

function init(){
    //shortcuts
    document.getElementById("input_answer").addEventListener("keypress", function(event) {
        //submit answer
        if(event.key === "Enter"){
            event.preventDefault();
            checkAnswer();
            document.getElementById("input_answer").value = "";
            document.getElementById("input_answer").type = "hidden";
        }
    });
    document.addEventListener("keypress", function(event) {
        //don't want shortcuts while typing answer
        if (event.target.tagName.toLowerCase() === "input") {
           return;
        }
        //next clue
        if(event.key === "j"){
            clearTimeout(timer);
            getClue(); 
        }
        //show answer (give up)
        if(event.key === "s"){
            clearTimeout(timer);
            document.getElementById("answer").innerText = answer; 
            prevent_buzz = true;
        }
        //buzz in
        if(event.key === " "){
            if(prevent_buzz){
                return;
            }
            clearTimeout(timer);
            document.getElementById("input_answer").type = "";
            document.getElementById("input_answer").focus();
            setTimeout(function() {
                checkAnswer();
                document.getElementById("input_answer").value = "";
                document.getElementById("input_answer").type = "hidden";
            }, 5000);
        } 
    });
    document.getElementById("total").innerText = total;
}

async function getClue(){
    //new clue means player should be able to buzz  
    prevent_buzz = false;
    const post = await fetch("https://free-jep-api.fly.dev/random").then((res) => res.json());
    question = post.clue_question;
    answer = post.clue_answer;  
    year = post.game_year;
    category = post.clue_category;
    let string_value = post.clue_value;
    console.log(string_value);
    //daily doubles count for 2000
    if (string_value === "DD"){
        value = 2000;
    } else if (string_value === "FINAL"){
        value = 9999;
    } else {
        string_value = string_value.replace('$', '');
        value = parseInt(string_value);
    }
    document.getElementById("question").innerText = question;
    document.getElementById("answer").innerText = "";
    document.getElementById("year").innerText = year;
    document.getElementById("value").innerText = value;
    document.getElementById("category").innerText = category;
    console.log("updated clue");
    //start 5 second timer to buzz in
    timer = setTimeout(function() {
        prevent_buzz = true;
        document.getElementById("answer").innerText = answer; 
    }, 5000);
}

function checkAnswer(){
    //if prevent_buzz is true then the answer has already been check by player pressing enter
    if (prevent_buzz == true){
        return;
    }
    prevent_buzz = true;
    console.log("checking answer");
    let input_answer = document.getElementById("input_answer").value;
    if(input_answer.trim().toLowerCase() === answer.trim().toLowerCase()){
        total += value;
    } else {
        total -= value;
    }
    document.getElementById("answer").innerText = answer; 
    document.getElementById("total").innerText = total;
}

