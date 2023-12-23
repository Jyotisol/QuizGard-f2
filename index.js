
// Sample quiz data


let quizData = [
  {
    "category": "General Knowledge",
    "questions": [
      {
        "question": "Who wrote 'To Kill a Mockingbird'?",
        "options": ["Harper Lee", "George Orwell", "Jane Austen", "F. Scott Fitzgerald"],
        "answer": "Harper Lee"
      },
      {
        "question" : "Who is the Father of our Nation?",
        "options" : ["Mahatma Gandhi", "Narendra Modi", "Amit Shah", "Dr. Rajendra Prasad"],
        "answer" : "Mahatma Gandhi"
      },
      {
        "question" : "Who was the first President of India?",
        "options" : ["Dr. B. R. Ambedkar", "Rahul Gandhi", "mahatma gandhi", "A.P.J Kalam", "Dr. Rajendra Prasad"],
        "answer" : "Dr. Rajendra Prasad"
      }
  ]
  }


// Function to display the quiz questions
function displayQuestions() {
    const questionsContainer = document.querySelector('.new-section');

    // Clear any existing content
    questionsContainer.innerHTML = '';

    // Loop through quiz data and create HTML elements for questions
    quizData.forEach((questionObj, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        // Create elements for the question and options
        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${questionObj.question}`;
        questionElement.appendChild(questionText);

        // Create radio buttons for options
        questionObj.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('input');
            optionElement.setAttribute('type', 'radio');
            optionElement.setAttribute('name', `question${index}`);
            optionElement.setAttribute('value', optionIndex);
            optionElement.classList.add('option');

            const optionLabel = document.createElement('label');
            optionLabel.textContent = option;
            optionLabel.insertBefore(optionElement, optionLabel.firstChild);

            questionElement.appendChild(optionLabel);
        });

        questionsContainer.appendChild(questionElement);
    });

    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Answers';
    submitButton.addEventListener('click', submitQuiz);
    questionsContainer.appendChild(submitButton);
}

// Function to handle quiz submission
function submitQuiz() {
    const questions = document.querySelectorAll('.question');
    let score = 0;

    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input:checked');

        if (selectedOption) {
            const selectedAnswer = parseInt(selectedOption.value);
            if (selectedAnswer === quizData[index].answer) {
                score++;
            }
        }
    });

    // Display score or perform any other action based on the score
    alert(`Your score is: ${score} out of ${quizData.length}`);
}

// Event listener for the "Start solving" button
document.getElementById('startButton').addEventListener('click', function() {
    displayQuestions();
});




let currentQuestion = 0;
let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let quizData = [];
let userName = "";
let selectedOption = "";
const loadQuizData = async () => {
  const res = await fetch("quizData.json");
  quizData = await res.json();
  loadQuestion();
};
const loadQuestion = () => {
  const questionObj = quizData[currentQuestion];
  document.getElementById("question").innerText = questionObj.question;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.innerText = questionObj.options[i];
    btn.className = "option-btn";
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.cursor = "default";
  }
  document.getElementById("message").innerText = "";
  document.getElementById("next-btn").style.display = "none";
};
const startQuiz = () => {
  userName = prompt("Enter your username");
  document.getElementById("start-page").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  loadQuizData();
};
const endQuiz = () => {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("score-container").style.display = "block";
  document.getElementById("final-score").innerText = score;
  const highScore = Math.max(...highScores.map((item) => item.score), score);
  document.getElementById("final-high-score").innerText = highScore;
  highScores.push({
    username: userName,
    score: score,
    date: new Date().toISOString(),
  });
  highScores.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("highScores", JSON.stringify(highScores));
};
const showHighscores = () => {
  document.getElementById("start-page").style.display = "none";
  document.getElementById("highscore-page").style.display = "block";
  document.getElementById("highscores").innerHTML = highScores
    .map(
      (item) =>
        `<p>${item.username}: ${item.score} (on ${new Date(
          item.date
        ).toLocaleDateString()} at ${new Date(
          item.date
        ).toLocaleTimeString()})</p>`
    )
    .join("");

  if (highScores.length == 0) {
    document.getElementById("highscores").innerHTML =
      "<h3>No Scores Yet!</h3><h4>Play the game to see your score's here.</h4>";
    // https://avivashishta29.github.io/quiz-app-html/
  }
};

document.getElementById("start-btn").addEventListener("click", startQuiz);
document
  .getElementById("highscore-btn")
  .addEventListener("click", showHighscores);
document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;
    document.getElementById("progress-bar-text").innerText = `${Math.round(
      progress
    )}%`;
  } else {
    endQuiz();
  }
});
for (let i = 0; i < 4; i++) {
  document.getElementById(`btn${i}`).addEventListener("click", (event) => {
    selectedOption = event.target;
    if (
      quizData[currentQuestion].options[i] === quizData[currentQuestion].answer
    ) {
      score++;
      document.getElementById("score").innerText = score;
      selectedOption.className = "option-btn correct";
      document.getElementById("message").innerText = "Correct Answer!";
    } else {
      selectedOption.className = "option-btn wrong";
      document.getElementById("message").innerText = "Wrong Answer!";
    }
    for (let j = 0; j < 4; j++) {
      document.getElementById(`btn${j}`).disabled = true;
      document.getElementById(`btn${j}`).style.cursor = "not-allowed";
      document.getElementById(`btn${j}`).style.opacity = 0.5;
    }
    selectedOption.style.opacity = 1;
    document.getElementById("next-btn").style.display = "block";
  });
}