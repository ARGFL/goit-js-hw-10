console.log("JavaScript is running!");

import axios from 'axios';
import SlimSelect from 'slim-select';


// Configurarea antetului global pentru toate cererile
axios.defaults.headers.common["x-api-key"] = "live_JAhqPf1psYfKGOt5hUDrGPjUBSVCTIKwAJi81bNTLuAbfMOcLlj3wuLO2yL8mOyt";

// Funcția fetchBreeds pentru a obține lista de rase de pisici
function fetchBreeds() {
    console.log('Apel fetchBreeds');  // Log pentru a verifica apelul funcției
    return axios.get('https://api.thecatapi.com/v1/breeds')
      .then(response => {
        console.log('Răspuns API:', response.data);  // Verifică răspunsul API
        return response.data;
      })
      .catch(error => {
        console.error('Eroare la obținerea listelor de rase:', error);
        throw error;
      });
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');  // Log pentru a verifica încărcarea DOM-ului
  const breedSelect = document.querySelector('.breed-select');
  const catInfoDiv = document.querySelector('.cat-info');
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');

  // Ascunde mesajele de loader și eroare inițial
  loader.style.display = 'none';
  error.style.display = 'none';

  // Funcția pentru a popula dropdown-ul
  function populateBreeds() {
    console.log('populateBreeds a fost apelată');  // Log pentru a verifica apelul funcției populateBreeds
    loader.style.display = 'block'; // Afișează loader-ul
    fetchBreeds()
      .then(breeds => {
        console.log('Rase primite:', breeds);  // Log pentru a verifica rasele primite
        breeds.forEach(breed => {
          console.log('Adăugare rasă:', breed.name);  // Log pentru a verifica fiecare rasă adăugată
          const option = document.createElement('option');
          option.value = breed.id;
          option.textContent = breed.name;
          breedSelect.appendChild(option);
        });
        loader.style.display = 'none'; // Ascunde loader-ul după încărcare
        console.log('Dropdown populat');  // Log pentru a confirma că dropdown-ul a fost populat

        // Inițializează SlimSelect după ce dropdown-ul este populat
        new SlimSelect({
          select: '.breed-select'
        });
      })
      .catch(err => {
        loader.style.display = 'none';
        error.style.display = 'block'; // Afișează mesajul de eroare în caz de eșec
        console.error('Eroare la popularea select-ului cu rase:', err);
      });
  }

  // Funcția pentru a afișa informațiile despre rasa selectată
  function displayCatInfo(breedId) {
    console.log('displayCatInfo a fost apelată pentru breedId:', breedId);  // Log pentru a verifica apelul funcției displayCatInfo
    const catInfoDiv = document.querySelector('.cat-info');
    const loader = document.querySelector('.loader');
    const error = document.querySelector('.error');

    if (!breedId) {
      catInfoDiv.innerHTML = '<p>Selectați o rasă pentru a vedea informații.</p>';
      return;
    }
    loader.style.display = 'block'; // Afișează loader-ul
    fetchBreeds()
      .then(breeds => {
        const selectedBreed = breeds.find(breed => breed.id === breedId);
        console.log('Informații rasă selectată:', selectedBreed);  // Log pentru a verifica informațiile rasei selectate

        catInfoDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start;">
            <img src="${selectedBreed.image?.url}" alt="${selectedBreed.name}" style="max-width: 500px; height: 400px; margin-right: 20px ">
            <div>
              <h2>${selectedBreed.name}</h2>
              <p>${selectedBreed.description}</p>
              <p><strong>Temperament:</strong> ${selectedBreed.temperament}</p>
            </div>
          </div>
        `;
        loader.style.display = 'none'; // Ascunde loader-ul după încărcare
      })
      .catch(err => {
        loader.style.display = 'none';
        error.style.display = 'block'; // Afișează mesajul de eroare în caz de eșec
        console.error('Eroare la afișarea informațiilor despre pisică:', err);
      });
  }

  // Populează select-ul când pagina este încărcată
  populateBreeds();

  // Ascultă pentru schimbări în select-ul de rase
  breedSelect.addEventListener('change', (event) => {
    console.log('Select a fost schimbat la:', event.target.value);  // Log pentru a verifica selecția utilizatorului
    displayCatInfo(event.target.value);
  });
});

