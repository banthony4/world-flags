// Variables
const countryList = document.getElementById('country-container');
const triviaContainer = document.getElementById('trivia-container');
const filters = document.getElementById('country-filters')
const studyBttn = document.getElementById('study-button');
const triviaBttn = document.getElementById('quiz-button');
const howToPlay = document.getElementById('how-to-play');
const languageSelect = document.getElementById('language-select');
const flagsArray = [];
const countriesArray = [];
let incorrect = 0;
let correct = 0;
const baseUrl = 'https://restcountries.com/v3.1/all';
const fetchCountries = () => {
    return fetch(baseUrl)
        .then(resp => resp.json())
};


// create Card for each Country
const renderCountries = (country) => {
    const countryCard = document.createElement('div')
    countryCard.className = 'card'

    const figure = document.createElement('figure')
    figure.className = 'flag-container'
    const countryFlag = document.createElement('img')
    countryFlag.src = country.flags.svg
    countryFlag.alt = country.name.official
    countryFlag.class = 'flags'
    figure.append(countryFlag)

    const countryName = document.createElement('h3')
    countryName.className = 'country-name'
    countryName.textContent = country.name.common

    const countryCapital = document.createElement('h4')
    countryCapital.textContent = `Capital: ${country.capital}`

    const population = document.createElement('p')
    population.textContent= `Population: ${country.population}`

    const continent = document.createElement('p')
    continent.textContent = `Continent: ${country.continents}`

    countryCard.append(figure, countryName, countryCapital, population, continent)
    countryList.appendChild(countryCard)
};


// trivia page
const renderTrivia = () => {
    window.scrollTo(0,70)
    const triviaGame = document.createElement('div')
    triviaGame.id = 'trivia-game'

    const header = document.createElement('div')
    header.className = 'header'
    const hintBttn = document.createElement('button')
    hintBttn.id = 'hint'
    hintBttn.textContent = ' Hint? '
    hintBttn.addEventListener("click", renderHint)
    const timer = document.createElement('button');
    timer.textContent = 60
    timer.id = 'timer'
    header.append(hintBttn, timer)

    const startOver = document.createElement('button');
    startOver.id = 'start-over'
    startOver.textContent = 'START OVER'
    startOver.addEventListener('click', reload);

    const flagAndHint = document.createElement("div"); 
    flagAndHint.id = "flag-hint-div"
    const flag = document.createElement("img");
    flag.id = 'trivia-flag'
    const showHint = document.createElement('h4')
    showHint.id = 'show-hint'
    flagAndHint.append(flag, showHint);
    
    const h3 = document.createElement('h3');
    h3.textContent = 'Answer:'
    h3.id = 'h3'
    const img = document.createElement("img")
    img.id = 'game-over'

    const form = document.createElement('form');
    form.id = 'form'
    form.addEventListener("submit", (e) => submitAnswer(e));
    
    const input = document.createElement('input');
    input.type = 'text'
    input.name = 'answer'
    input.placeholder = 'Type Answer Here'
    input.id = "answer"
    const submit = document.createElement('input');
    submit.type = 'submit'
    submit.name = 'submit'
    submit.class = 'submit'
    submit.id = "submit-input"
    
    form.append(input, submit)

    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard'
    const h2 = document.createElement('h2');
    h2.id = "h2"
    h2.textContent = 'Scoreboard: '
    scoreboard.append(h2);
    const score = document.createElement('h2')
    score.id = 'score'
    score.innerHTML = `<span class='right'>Correct: ${correct}</span><span class='wrong'> Incorrect: ${incorrect}</span>`

    triviaGame.append(header, startOver, flagAndHint, img, h3, form, scoreboard, score);
    triviaContainer.append(triviaGame);
}


//Render Randomized Country flag to Trivia Game
const countryFlags = () => {
    fetchCountries()
    .then(country => {
        country.forEach((country)=> {
            flagsArray.push(country.flags.svg)
            countriesArray.push(country.name.official)
        })
        renderRandomFlag(flagsArray, countriesArray)
    })
}
const renderRandomFlag = (flags, countries) => {
    const randomIndex = Math.floor(Math.random() * flags.length)
    const flagImg = flags[randomIndex]
    const flagAlt = countries[randomIndex]
    appendFlagToTrivia(flagImg, flagAlt)
}
const appendFlagToTrivia = (flagImg, flagAlt) => {
    const flag = document.getElementById('trivia-flag')
    flag.src = flagImg
    flag.alt = flagAlt
}


// functions for trivia game
function submitAnswer(e) {
    e.preventDefault();
    document.getElementById('show-hint').textContent = ''
    const correctAnswer = document.getElementById('trivia-flag').alt.toLowerCase()
    const score = document.getElementById('score')
    const timer = document.getElementById('timer')
    const triviaBoard = document.getElementById('trivia-game')
    const answer = document.createElement('h2')
    answer.className = 'answer-list'
    if(correctAnswer.includes(e.target.answer.value.toLowerCase()) && e.target.answer.value.length > 3){
        score.innerHTML = `<span class='right'>Correct: ${++correct}</span><span class='wrong'> Incorrect: ${incorrect}</span>`
        timer.innerText = parseInt(timer.innerText) + 10
        answer.innerText = e.target.answer.value
        answer.style.color = '#1F2833'
        triviaBoard.append(answer)
    } else {
        score.innerHTML = `<span class='right'>Correct: ${correct}</span><span class='wrong'> Incorrect: ${++incorrect}</span>`
        timer.innerText = parseInt(timer.innerText) - 10
        answer.innerText = `Your answer: ${e.target.answer.value}; Correct answer: ${correctAnswer}`
        answer.style.color = 'red'
        triviaBoard.append(answer)
    }
    countryFlags()
    form.reset();
};

const renderHint = () => {
    const img = document.getElementById('trivia-flag')
    const showHint = document.getElementById('show-hint')
    fetch(`https://restcountries.com/v3.1/name/${img.alt}`)
    .then(resp => resp.json())
    .then(country => country.forEach(country => {
        showHint.textContent = `Capital: ${country.capital}`
    }))
}

const decrementCounter = () => {
    let timer = document.getElementById('timer')
    if(timer.innerText > 0 ){
        timer.innerText = parseInt(timer.innerText) - 1
        if(timer.innerText < 10){
            timer.style.color = 'red';
        }
    } else {
        gameOver();
    }
    clearInterval(timer);
};

const gameOver = () => {
    document.getElementById('timer').style.display = 'none'
    document.getElementById('hint').style.display = 'none'
    document.getElementById('trivia-flag').style.display = 'none'
    document.getElementById('form').style.display = 'none'
    document.getElementById('timer').style.display = 'none'
    document.getElementById('scoreboard').style.display = 'none'
    document.getElementById('h3').style.display = "none"
    document.getElementById("show-hint").style.display = "none"
    const img = document.getElementById("game-over")
    img.src = "https://lh3.googleusercontent.com/F35zenxbXDwNYKyHnEWkcRO7srs80fT59yBxpUYRwUP46H1Qty_j5PYPmRYSCPecBfJIF--wh5N4RKvgFUqmd23QuYFWNckC0H2760rK11mlKzDTUU_9e2v_iVJs7GbB3Hx_VOKQnw=w2400"
}



// search for countries
const addSearchBar = () => {
    const searchBar = document.createElement('form')
    searchBar.className = 'search-bar'
    
    const input = document.createElement('input')
    input.type = 'search'
    input.name = 'search'
    input.id = 'search'
    input.placeholder = 'Search for a country...'
    input.addEventListener('input', (e) => countrySearch(e))

    searchBar.append(input)
    filters.append(searchBar)
}
const countrySearch = (e) => {
    const value = e.target.value.toLowerCase()
    const countrySearchName = document.querySelectorAll('.country-name')
    countrySearchName.forEach((name) => {
        if(name.textContent.toLowerCase().includes(value)) {
            name.parentElement.style.display = 'inline-grid'
        } else {
            name.parentElement.style.display = 'none'
        }
    })
}


const reload = () => {
    countryList.replaceChildren()
    triviaContainer.replaceChildren()
    incorrect=0
    correct=0
    renderTrivia()
    countryFlags()
};


// Event Listeners
studyBttn.addEventListener('click', () => {
    countryList.replaceChildren()
    triviaContainer.replaceChildren()
    filters.replaceChildren()
    fetchCountries()
    .then(countries => countries.forEach(renderCountries))
    .then(addSearchBar())
})
triviaBttn.addEventListener('click', () => {
    countryList.replaceChildren()
    triviaContainer.replaceChildren()
    filters.replaceChildren()
    incorrect=0
    correct=0
    renderTrivia()
    setInterval(decrementCounter, 1000)
    countryFlags()
})
