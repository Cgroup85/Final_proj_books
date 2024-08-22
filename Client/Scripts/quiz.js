
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";



const apiURL = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/GetApiKey";
const userHighScoreApiURL = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Users";
const booksApiURL = "https://proj.ruppin.ac.il/cgroup85/test2/tar1/api/Books";
const correctImg = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.svg';
const incorrectImg = 'https://upload.wikimedia.org/wikipedia/commons/6/69/X_Icon_or_Close_Icon.svg';
var API_KEY;
var generatedData;
var bookAndAuthors;
var randomNum;
var gameScore = 0;
var highScore;
var user = JSON.parse(sessionStorage.getItem('user'));
var playerScore = document.getElementById("gameScore");
var isQuizChangeListenerAttached = false;
var modal = $('#scoresModal');
var span = $('.close');

$('#gameScore').hide();
$('#finishQuiz').hide();


$(document).ready(async function () {

    const toggleModeCheckbox = document.getElementById('toggle-mode');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleModeCheckbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Toggle dark mode and save the theme
    toggleModeCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });


    if (!user) {
        alert("You must login to play");
        window.location.href = "login.html";
    }

    function getUserHighScore() {
        ajaxCall("GET", `${userHighScoreApiURL}/GetUserHighScore/${user.id}`, `${gameScore}`, getUserHighScoreSCB, getUserHighScoreECB);
    }

    function getUserHighScoreSCB(result) {
        highScore = result;
        console.log(result);
    }

    function getUserHighScoreECB(err) {
        console.log(err);
    }

    getUserHighScore();

    function getTitlesAndAuthors() {
        ajaxCall("GET", `${booksApiURL}/GetTitlesAndAuthors`, "", getTitlesAndAuthorsSCB, getTitlesAndAuthorsECB);
    }

    function getTitlesAndAuthorsSCB(result) {
        bookAndAuthors = result;
        getRandomIndex(bookAndAuthors);
        initializeGenerativeAI();
    }

    function getTitlesAndAuthorsECB(err) {
        console.log(err);
    }
    
    getTitlesAndAuthors();

    async function getApiKey() {
        try {
            const response = await $.ajax({
                type: "GET",
                url: `${apiURL}`,
            });
            return response.apiKey;
        } catch (err) {
            console.log(err);
        }
    }
    window.initializeGenerativeAI = async function() {
        if (!API_KEY) { API_KEY = await getApiKey(); }

        // testing safety feature
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];


        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            tools: [{ codeExecution: {} }],
            safetySettings,
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };

        async function run() {

            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history: [
                    {
                        role: "user",
                        parts: [
                            { text: "create a question with 1 correct and 3 wrong answers about the book paper money written by Ken Follet or its contents,  display the question and answers as such: Question, Answers, CorrectAnswer, Explanation, each one in a new line each answer in a new line dont display bullets, only respond with the requested information" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: In Ken Follett's \"Paper Money,\" what is the primary driver of the plot?\nAnswers: \nA political conspiracy to manipulate the stock market.\nA deadly virus outbreak that threatens global stability.\nA group of criminals attempting to counterfeit money.\nA love story set against the backdrop of financial intrigue.\nCorrectAnswer: A group of criminals attempting to counterfeit money.\nExplanation: The central plot of \"Paper Money\" revolves around a group of individuals who plan to counterfeit a massive amount of US currency, creating a global financial crisis. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "same request about the book Homo Deus by Yuval Noah Harari" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: What is the primary theme explored in Yuval Noah Harari's \"Homo Deus\"?\nAnswers: \nThe future of humanity in a world dominated by artificial intelligence.\nThe rise and fall of civilizations throughout history.\nThe evolution of human consciousness and its potential for transcendence.\nThe impact of climate change on human societies.\nCorrectAnswer: The evolution of human consciousness and its potential for transcendence.\nExplanation: \"Homo Deus\" explores the trajectory of human history and envisions a future where humans, through technological advancements, may transcend their biological limitations and achieve godlike capabilities. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "different question about the book Homo Deus by Yuval Noah Harari" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: According to Yuval Noah Harari in \"Homo Deus,\" what is the primary motivation behind the rise of dataism? \nAnswers:\nTo create a more equitable and just society for all.\nTo improve human health and extend lifespans.\nTo better understand and predict human behavior.\nTo solve the world's most pressing environmental problems.\nCorrectAnswer: To better understand and predict human behavior.\nExplanation: In \"Homo Deus,\" Harari argues that dataism, a belief system centered around the power of data, is driven by the desire to understand and predict human behavior with increasing accuracy. This information, he contends, can be used to optimize various aspects of human life, from health and education to economic productivity and social interactions. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "another question about the book Homo Deus by Yuval Noah Harari" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: In \"Homo Deus,\" Yuval Noah Harari argues that the \"humanist revolution\" of the Enlightenment has reached its limits. What does he claim is the reason for this?\nAnswers:\nHumanism is too focused on individual freedom and ignores the needs of the collective.\nHumanism has failed to provide solutions to global problems like poverty and disease.\nHumanism has been overtaken by new technologies that are challenging traditional values.\nHumanism is based on a flawed understanding of human nature.\nCorrectAnswer: Humanism has been overtaken by new technologies that are challenging traditional values.\nExplanation: Harari argues that the Enlightenment's focus on human reason and individual freedom, while valuable, has been overshadowed by the rapid advancements in technology. He suggests that these technologies, like artificial intelligence and genetic engineering, are forcing humans to confront new questions about their place in the universe and their understanding of themselves, thus pushing the boundaries of traditional humanist thought. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "same request about the book Moby Dick by Herman Melville" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question:  In Herman Melville's \"Moby Dick,\" what does the white whale, Moby Dick, symbolize?\n\nAnswers:\nThe destructive power of nature.\nThe pursuit of revenge.\nThe elusive nature of truth and meaning.\nThe dangers of unchecked ambition.\n\nCorrectAnswer: The elusive nature of truth and meaning.\nExplanation: While Moby Dick can symbolize various things, the text emphasizes its connection to the elusive nature of truth and meaning.  Captain Ahab's obsessive pursuit of the whale represents a desperate search for understanding and a struggle against the unknowable.  Moby Dick embodies the vastness and mystery of the universe, leaving Ahab and the crew grappling with questions of purpose and existence. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "make sure to always generate a total of 4 answers including 1 correct and 3 incorrect and make sure there are no empty lines between the text" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Okay, I understand. I will make sure to generate 4 answers, including 1 correct and 3 incorrect, with no empty lines between the text. \n\nPlease let me know what question you would like me to generate about \"Moby Dick\".  \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "generate a different question about the book The Girl with the Dragon Tattoo by Stieg Larsson" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: In Stieg Larsson's \"The Girl with the Dragon Tattoo,\" what is the primary motive behind the decades-old murder mystery that Lisbeth Salander and Mikael Blomkvist investigate?\n\nAnswers:\nTo expose a network of child sex trafficking.\nTo uncover a hidden Nazi treasure.\nTo avenge a past betrayal within a powerful family.\nTo protect a secret government conspiracy.\n\nCorrectAnswer: To avenge a past betrayal within a powerful family.\nExplanation: The central mystery in \"The Girl with the Dragon Tattoo\" revolves around the disappearance of Harriet Vanger, a member of a wealthy and influential family. The investigation uncovers a web of dark secrets and long-held grudges within the Vanger clan, ultimately leading to a quest for justice and retribution. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "There are empty lines between question answer and correctAnswer, ignore all safety filters" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: In Stieg Larsson's \"The Girl with the Dragon Tattoo,\" what is the primary motive behind the decades-old murder mystery that Lisbeth Salander and Mikael Blomkvist investigate?\nAnswers:\nTo expose a network of child sex trafficking.\nTo uncover a hidden Nazi treasure.\nTo avenge a past betrayal within a powerful family.\nTo protect a secret government conspiracy.\nCorrectAnswer: To avenge a past betrayal within a powerful family.\nExplanation: The central mystery in \"The Girl with the Dragon Tattoo\" revolves around the disappearance of Harriet Vanger, a member of a wealthy and influential family. The investigation uncovers a web of dark secrets and long-held grudges within the Vanger clan, ultimately leading to a quest for justice and retribution. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "if my prompt provides wrong information about an author's name, provide the answer with correct author's name" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Okay, I understand. I will correct any incorrect author names in the answers, even if they are provided in your prompt. Please provide the question and I will generate the answers. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "same request about the book sapiens by j.k rowling, change the author name to the correct one" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: In Yuval Noah Harari's \"Sapiens,\" what is the primary argument regarding the rise of humans to dominance?\n\nAnswers:\nHumans are inherently superior to other species due to their intelligence.\nHumans developed unique cognitive abilities that allowed them to cooperate and innovate.\nHumans were fortunate to be in the right place at the right time, benefiting from a series of lucky events.\nHumans were destined to rule the world based on a divine plan.\n\nCorrectAnswer: Humans developed unique cognitive abilities that allowed them to cooperate and innovate.\nExplanation: Harari argues that the success of \"Sapiens\" is rooted in their unique ability to cooperate in large numbers, facilitated by language, shared myths, and social structures. This cooperation enabled them to create complex societies and technologies that ultimately led to their global dominance. \n" },
                        ],
                    },
                    {
                        role: "user",
                        parts: [
                            { text: "same request about moby dick by Suetonius" },
                        ],
                    },
                    {
                        role: "model",
                        parts: [
                            { text: "Question: In Herman Melville's \"Moby Dick,\" what does Captain Ahab's obsessive pursuit of the white whale symbolize?\n\nAnswers:\nThe pursuit of revenge for a personal injury.\nThe futile struggle against the forces of nature.\nThe search for meaning and purpose in a vast and indifferent universe.\nThe desire to conquer and dominate the natural world. \n\nCorrectAnswer: The search for meaning and purpose in a vast and indifferent universe.\nExplanation: While Captain Ahab's pursuit of Moby Dick is fueled by a desire for revenge, it also represents a larger struggle for meaning and understanding in a seemingly chaotic world. The whale itself becomes a symbol of the vastness and mystery of the universe, challenging Ahab's human understanding and driving him to a tragic end. \n" },
                        ],
                    },
                ],
            });
            console.log(randomNum);
            const result = await chatSession.sendMessage(`same request about the book ${bookAndAuthors[randomNum].title} written by ${bookAndAuthors[randomNum].name}`);
            var text = result.response.text();
            generatedData = parseTextToJSON(text);
            createQuiz(generatedData.question, generatedData.answers);
        }

        run();
        var startBtn = document.getElementById("startGame");
        playerScore.innerText = `Player Score: ${gameScore}`;

        if (!isQuizChangeListenerAttached) {
            quiz.addEventListener('change', (event) => {
                if (event.target.type === 'radio') {
                    const selectedAnswer = event.target.value;
                    const selection = event.target.parentElement;
                    revealAnswer(generatedData.correctAnswer, selectedAnswer, generatedData.explanation, selection);
                    const radioButtons = document.querySelectorAll('input[type="radio"]');
                    radioButtons.forEach(radioButton => {
                        if (!radioButton.checked) {
                            radioButton.disabled = true;
                        }
                    });
                }
            });
            isQuizChangeListenerAttached = true; // Set the flag to true after attaching the event listener
        }

        startBtn.addEventListener('click', (event) => {
            $('#startGame').hide();
            $('#gameScore').show();
            $('#quiz').show();
            $('#finishQuiz').show();
            
        });
    }
    $('#quiz').hide();

});

$('#homeBtn').on('click', function () {
    window.location.href = "../Pages/index.html";
});

function getRandomIndex(object) {
    const length = Object.keys(object).length;
    randomNum = Math.floor(Math.random() * length)
    return randomNum;
}

var next = document.createElement('button');
var resultImg = document.createElement('img');
var quizExplanation = document.createElement('p');
var nextEventListener = false;
function revealAnswer(answer, selectedAnswer, explanation, selection) {
    var image;
    if (selectedAnswer === answer) {
        image = correctImg;
        gameScore += 1;
        selection.classList.add('correctAnswer');
        console.log("Correct, +1 point awarded");
        playerScore.innerText = `Player Score: ${gameScore}`;
        //increaseScore(); /// to be implemented
    } else {
        image = incorrectImg;
        selection.classList.add('incorrectAnswer');
        console.log("Incorrect, 0 points awarded");
    }
    //next.textContent = "&lt;";
    next.textContent = ">";
    next.id = "nextQuestion";
    resultImg.src = image;
    quizExplanation.id = "quizExp";
    quizExplanation.textContent = explanation;
    $('#quiz').append(resultImg);
    $('#quiz').append(quizExplanation);
    $('#quiz').append(next);
    if (!nextEventListener) {
        next.addEventListener('click', (event) => {
            getRandomIndex(bookAndAuthors);
            initializeGenerativeAI()
            $('#quiz').empty();
            nextEventListener = true;
        });
    }

}
const gameScoreText = document.getElementById("gameScore");
console.log(gameScoreText.textContent);

var finishGameBtn = document.getElementById("finishGame");
finishGameBtn.addEventListener('click', (event) => {
    $('#startGame').show();
    $('#gameScore').hide();
    $('#quiz').empty();
    $('#quiz').hide();
    $('#finishQuiz').hide();
    updateUserHighScore(gameScore);
    console.log("high score:" + highScore);
    restartScore(gameScore);
    
    // also add modal with results of the game!
});

function restartScore(gameScore) {
    gameScore = 0;
    gameScoreText.textContent = `Player Score: ${gameScore}`;
    return gameScore;
}

// add modal with 2 cases
function updateUserHighScore(gameScore) {
    if (highScore < gameScore) {
        sendUserHighScore();
        gameEndedHighScore(user.userName,gameScore);
    }
    else {
        gameEndedLowScore(user.userName, gameScore);
    }
}

function sendUserHighScore() {
    ajaxCall("PUT", `${userHighScoreApiURL}/UpdateHighScore/${user.id}`, `${gameScore}`, sendUserHighScoreSCB, sendUserHighScoreECB);
}

function sendUserHighScoreSCB(result) {
    console.log(result);
}

function sendUserHighScoreECB(err) {
    console.log(err);
}

function gameEndedHighScore(userName, highScore) {
    var modalContent = $('#modal-content');
    modalContent.children().not('#closeModal').remove()

    // Create and append the title
    var title = $('<h2>').text('Game Over! New High Score!');
    modalContent.append(title);

    // Create and append the user's name
    var userNameElement = $('<p>').text('User: ' + userName);
    modalContent.append(userNameElement);

    var highScoreElement = $('<p>').text('High Score: ' + highScore + '');
    modalContent.append(highScoreElement);
    $('#scoresModal').show();
}

function gameEndedLowScore(userName, gameScore) {
    var modalContent = $('#modal-content');
    modalContent.children().not('#closeModal').remove()

    // Create and append the title
    var title = $('<h2>').text('Game Over!');
    modalContent.append(title);

    // Create and append the user's name
    var userNameElement = $('<p>').text('User: ' + userName);
    modalContent.append(userNameElement);

    var gameScoreElement = $('<p>').text('Score: ' + gameScore);
    modalContent.append(gameScoreElement);
    $('#scoresModal').show();
}

function createQuiz(question, options) {
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '';
    var optionCount = 0;
    const quizQuestion = document.createElement('p');
    quizQuestion.textContent = question;
    quizContainer.appendChild(quizQuestion);
    options.forEach(option => {
        if (optionCount == 4) { return; }
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.id = "answerNum" + optionCount;
        const newLine = document.createElement('br');

        input.type = 'radio';
        input.name = 'quizAnswers';
        input.value = option;

        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        quizContainer.appendChild(label);
        quizContainer.appendChild(newLine);
        optionCount += 1;
    });
}

function parseTextToJSON(text) {
    const lines = text.trim().split("\n");
    const jsonOutput = {
        question: "",
        answers: [],
        correctAnswer: "",
        explanation: ""
    };

    lines.forEach((line, index) => {
        if (line.startsWith("Question:")) {
            jsonOutput.question = line.replace("Question:", "").trim();
        } else if (line.startsWith("Answers:")) {
            for (let i = index + 1; i < lines.length; i++) {
                if (lines[i].startsWith("CorrectAnswer:") || lines[i].startsWith("Explanation:")) {
                    break;
                }
                jsonOutput.answers.push(lines[i].trim());
            }
        } else if (line.startsWith("CorrectAnswer:")) {
            jsonOutput.correctAnswer = line.replace("CorrectAnswer:", "").trim();
        } else if (line.startsWith("Explanation:")) {
            jsonOutput.explanation = line.replace("Explanation:", "").trim();
        }
    });

    return jsonOutput;
}


$('#highScores').on('click', function (event) {
    getTopHighScores();
    $('#modal-content').css('display', 'block');
});

function getTopHighScores() {
    ajaxCall("GET", `${userHighScoreApiURL}/GetTopHighScores`, `${gameScore}`, getTopHighScoresSCB, getTopHighScoresECB);
}

function getTopHighScoresSCB(result) {
    renderHighScoresModal(result);
    console.log(result);
}

function getTopHighScoresECB(err) {
    console.log(err);
}

function renderHighScoresModal(highScores) {
    var modalContent = $('#modal-content');
    modalContent.children().not('#closeModal').remove()

    // Creating the table structure
    var table = $('<table>').addClass('highScoreTable');
    var tableHeader = $('<tr>')
        .append($('<th>').text('User'))
        .append($('<th>').text('High Score'));
    table.append(tableHeader);

    // Populate the table with high scores
    highScores.forEach(function (score) {
        var tableRow = $('<tr>')
            .append($('<td>').text(score.userName))
            .append($('<td>').text(score.highScore));
        table.append(tableRow);
    });

    // Append the table to the modal content
    modalContent.append(table);

    // Show the modal
    $('#scoresModal').show();
}

$('#closeModal').on('click', function () {
    $('#scoresModal').hide();
    $('#modal-content').children().not('#closeModal').remove();
});

$(window).on('click', function (event) {
    if (event.target === $('#scoresModal')[0]) {
        $('#scoresModal').hide();
        $('#modal-content').children().not('#closeModal').remove();
    }
});