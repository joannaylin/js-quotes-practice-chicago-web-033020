const QUOTES_URL = "http://localhost:3000/quotes"
const LIKES_URL = "http://localhost:3000/likes"
const quotesContainer = document.querySelector("#quote-list")
const form = document.querySelector("#new-quote-form")
form.addEventListener("submit", createNewQuote)
quotesContainer.addEventListener("click", handleClick)

function fetchQuotes() {
  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(resp => resp.json())
  .then(quotes => renderQuotes(quotes))
}

function renderQuotes(quotes) {
  quotes.forEach(quote => renderOneQuote(quote))
}

function renderOneQuote(quote) {
  const quoteCard = `<li class='quote-card'>
    <blockquote class="blockquote" data-quote-id="${quote.id}">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes[0] ? quote.likes.length : 0}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
    </li>`
  quotesContainer.innerHTML += quoteCard
}

function createNewQuote(event) {
  event.preventDefault();

  const formData = {
    quote: event.target[0].value,
    author: event.target[1].value,
    likes: 0
  }

  const formObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch(QUOTES_URL, formObj)
  .then(resp => resp.json())
  .then(quote => renderOneQuote(quote))
  .catch(event => alert(event.message))

}

function handleClick(event) {
  if (event.target.className === "btn-success") {
    addLike(event)
  } else if (event.target.className === "btn-danger") {
    deleteQuote(event)
  }
}


function addLike(event) {
  const quoteId = event.target.parentNode.dataset.quoteId
  const likeElement = event.target
  const likeNum = event.target.innerText.split(" ")[1]

  const formData = {
    quoteId: parseInt(quoteId)
  }

  const formObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch(LIKES_URL, formObj)
  .then(resp => resp.json())
  .then(like => like)
  .catch(event => alert(event.message))

  likeElement.innerHTML = `Likes: <span>${parseInt(likeNum) + 1}</span>`

}


function deleteQuote(event) {
  const quoteId = event.target.parentNode.dataset.quoteId

  const formData = {
    quoteId: parseInt(quoteId)
  }

  const formObj = {
    method: "DELETE"
  }

  fetch(`${QUOTES_URL}/${quoteId}`, formObj)
  .then(resp => resp.json())
  .then(quote => quote)

  event.target.parentNode.parentNode.remove()
}


fetchQuotes()