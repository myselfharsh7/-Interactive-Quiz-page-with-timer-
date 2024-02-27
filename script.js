// Quiz questions and answers
const quizData = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Management Language", "Hyperlink and Text Management Language"],
        answer: 0
    },
    {
        question: "Which CSS property is used to control the spacing between lines of text?",
        options: ["line-height", "text-spacing", "line-spacing", "spacing"],
        answer: 0
    },
    {
        question: "Which of the following is NOT a valid HTTP status code?",
        options: ["200", "404", "302", "999"],
        answer: 3
    },
    {
        question: "Which JavaScript method is used to add a new element to an HTML document?",
        options: ["appendChild()", "createElement()", "addElement()", "insertElement()"],
        answer: 1
    },
    {
        question: "What is the purpose of the 'viewport' meta tag in HTML?",
        options: ["To set the width of the viewport", "To control the zoom level of the viewport", "To define the initial scale of the viewport", "All of the above"],
        answer: 3
    }
];

// Function to start the quiz
function startQuiz() {
    sessionStorage.setItem("startTime", new Date().getTime());
    window.location.href = "quiz.html";
}

// Function to display questions
function displayQuestions() {
    const questionsContainer = document.getElementById("questions");
    quizData.forEach((data, index) => {
        const questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <h3>${index + 1}. ${data.question}</h3>
            <ul>
                ${data.options.map((option, i) => `<li><input type="radio" name="question${index}" value="${i}">${option}</li>`).join("")}
            </ul>
        `;
        questionsContainer.appendChild(questionElement);
    });
}

// Function to submit the quiz
function submitQuiz() {
    clearInterval(timerInterval);
    const answers = []; // Array to store user's answers
    const questions = document.querySelectorAll("#questions > div"); // Select all question elements

    questions.forEach((question, index) => {
        const selectedOption = question.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption) {
            answers.push({
                question: question.querySelector("h3").textContent.trim(), // Get the question text
                answer: selectedOption.nextSibling.textContent.trim() // Get the text of the selected option
            });
        } else {
            answers.push({
                question: question.querySelector("h3").textContent.trim(), // Get the question text
                answer: "Not answered"
            });
        }
    });

    // Store the answers in session storage
    sessionStorage.setItem("userAnswers", JSON.stringify(answers));

    // Calculate and store the time taken
    const endTime = new Date().getTime();
    const startTime = parseInt(sessionStorage.getItem("startTime"));
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    sessionStorage.setItem("timeTaken", timeTaken);

    // Redirect to completion page
    window.location.href = "completion.html";
}

// Timer
let timeLeft = 300; // 5 minutes in seconds
const timerElement = document.getElementById("timer");
const timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerElement.textContent = `Time Left: ${minutes}:${seconds}`;
    
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        submitQuiz(); // Automatically submit quiz when timer completes
    } else {
        timeLeft--;
    }
}

// Execute updateTimer function only on quiz.html
if (window.location.pathname.endsWith("quiz.html")) {
    displayQuestions();
    updateTimer();
}

// Completion page
document.addEventListener("DOMContentLoaded", function() {
    const timeTaken = sessionStorage.getItem("timeTaken");
    const timeTakenElement = document.getElementById("timeTaken");
    if (timeTaken) {
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        timeTakenElement.textContent = `Time Taken: ${minutes} minutes ${seconds} seconds`;
    }

    const userAnswers = sessionStorage.getItem("userAnswers");
    const userAnswersElement = document.getElementById("userAnswers");
    if (userAnswers) {
        const answers = JSON.parse(userAnswers);
        answers.forEach((answer, index) => {
            const answerElement = document.createElement("p");
            answerElement.textContent = `${index + 1}. ${answer.question} - ${answer.answer}`;
            userAnswersElement.appendChild(answerElement);
        });
    }
});
