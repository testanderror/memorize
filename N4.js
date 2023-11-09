const cards = [];
for (let i = 1; i <= 12; i++) {
  const value = Math.ceil(i / 2); // Ensure pairs have the same value
  cards.push({
    id: `card${i}`,
    value: value.toString(),
    isFlipped: false,
  });
}

let firstCard = null;
let secondCard = null;

// Function to reset all cards to their initial state
function resetAllCards() {
  cards.forEach((card) => {
    card.isFlipped = false;
    document.getElementById(card.id).classList.remove('green', 'red');
  });
}

// Function to handle card click
function handleCardClick(cardId) {
  const card = cards.find((c) => c.id === cardId);

  if (!card.isFlipped) {
    card.isFlipped = true;
    document.getElementById(cardId).classList.add('green');

    if (firstCard === null) {
      firstCard = card;
    } else if (secondCard === null) {
      secondCard = card;

      // Check if the values match strictly
      if (firstCard.value === secondCard.value) {
        // Matching pair
        firstCard = null;
        secondCard = null;
      } else {
        // Non-matching pair
        document.getElementById(firstCard.id).classList.add('red'); // Add red class
        document.getElementById(secondCard.id).classList.add('red'); // Add red class

        setTimeout(() => {
          document.getElementById(firstCard.id).classList.remove('red');
          document.getElementById(secondCard.id).classList.remove('red');
        }, 1000);

        setTimeout(() => {
          document.getElementById(firstCard.id).classList.remove('red');
          document.getElementById(secondCard.id).classList.remove('red');
          resetAllCards(); // Reset all cards
          firstCard = null;
          secondCard = null;
        }, 1000);
      }
    }
  }
  countGreenChildElements();
}

function shuffleChildren() {
  resetAllCards();
  const container = document.querySelector('.memory-game');
  const cards = Array.from(container.children);
  cards.sort(() => Math.random() - 0.5); // Randomly shuffle the array

  // Clear the current content of the container
  container.innerHTML = '';

  // Append the shuffled cards back to the container
  cards.forEach((card) => container.appendChild(card));
  countGreenChildElements();
}

// Add click event listeners to the cards
cards.forEach((card) => {
  const cardElement = document.getElementById(card.id);
  cardElement.addEventListener('click', () => {
    handleCardClick(card.id);
  });
});

fetch('N4.json')
  .then((response) => response.json())
  .then((jsonData) => {
    const randomEntries = [];

    while (randomEntries.length < 6) {
      const randomIndex = Math.floor(Math.random() * jsonData.length);
      const randomEntry = jsonData[randomIndex];

      if (randomEntry.Vocabulary && randomEntry.Meaning) {
        randomEntry.Furigana = randomEntry.Furigana || ''; // Ensure Furigana is not undefined or null
        randomEntries.push(randomEntry);
      }
    }

    // Append the data to the HTML for each random entry
    randomEntries.forEach((entry, index) => {
      const card1 = document.getElementById(`card${2 * index + 1}`);
      const card2 = document.getElementById(`card${2 * index + 2}`);

      if (card1 && card2) {
        // Set the content of 'kanji' and 'furigana' elements in the appropriate div
        const kanjiElement = card1.querySelector('.kanji');
        const furiganaElement = card1.querySelector('.furigana');

        if (kanjiElement && furiganaElement) {
          kanjiElement.textContent = entry.Vocabulary;
          furiganaElement.textContent = entry.Furigana;
        }

        if (entry.Vocabulary.length > 4) {
          kanjiElement.style.fontSize = '20px';
          console.log('Entry Vocabulary length:', entry.Vocabulary.length);
        }
        // Set the content of the 'Meaning' element in the second div
        card2.textContent = entry.Meaning;
      }
    });
  })
  .catch((error) => console.error('Error loading JSON data:', error));

document.addEventListener('DOMContentLoaded', function () {
  // This code will run when the document is fully loaded
  shuffleChildren();
});

// Add a click event listener to the shuffle button
// ...
let shownData = [];
// Add a click event listener to the shuffle button
document.getElementById('shuffleButton').addEventListener('click', function () {
  // Fetch new data from the JSON file
  fetch('N4.json')
    .then((response) => response.json())
    .then((jsonData) => {
      const randomEntries = [];

      while (randomEntries.length < 6) {
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        const randomEntry = jsonData[randomIndex];

        // Check if the data is not a duplicate and has Vocabulary and Meaning
        if (
          randomEntry.Vocabulary &&
          randomEntry.Meaning &&
          !shownData.some(
            (entry) => entry.Vocabulary === randomEntry.Vocabulary
          )
        ) {
          randomEntry.Furigana = randomEntry.Furigana || ''; // Ensure Furigana is not undefined or null
          randomEntries.push(randomEntry);
          shownData.push(randomEntry); // Add the shown data to the array
        }
      }

      // Append the new data to the HTML for each random entry
      randomEntries.forEach((entry, index) => {
        const card1 = document.getElementById(`card${2 * index + 1}`);
        const card2 = document.getElementById(`card${2 * index + 2}`);

        if (card1 && card2) {
          // Set the content of 'kanji' and 'furigana' elements in the appropriate div
          const kanjiElement = card1.querySelector('.kanji');
          const furiganaElement = card1.querySelector('.furigana');

          if (kanjiElement && furiganaElement) {
            kanjiElement.textContent = entry.Vocabulary;
            furiganaElement.textContent = entry.Furigana;
            if (entry.Vocabulary.length > 4) {
              kanjiElement.style.fontSize = '25px';
            }
          }
          // Set the content of the 'Meaning' element in the second div
          card2.textContent = entry.Meaning;
        }
      });

      // Shuffle the displayed data
      shuffleChildren();
    })
    .catch((error) => console.error('Error loading JSON data:', error));
});
function countGreenChildElements() {
  // Get the parent element
  const memoryGame = document.querySelector('.memory-game');

  // Get all child elements
  const childElements = memoryGame.children;

  // Initialize a count variable
  let greenCount = 0;

  // Loop through the child elements and check for the "green" class
  for (let i = 0; i < childElements.length; i++) {
    if (childElements[i].classList.contains('green')) {
      greenCount++;
    }
  }

  console.log(`Elements Correct: ${greenCount}`);
  if (greenCount === 12) {
    setTimeout(function () {
      location.reload();
    }, 1000);
  }
  // Log the count to the console
}

// Call the function when needed
