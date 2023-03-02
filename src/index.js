import { Notify } from "notiflix/build/notiflix-notify-aio";
import debounce from "lodash.debounce";
import { fetchCountries } from "./js/fetchCountries";

const elements = {
  countriesList: document.querySelector(".country-list"),
  countryInfo: document.querySelector(".country-info"),
  searchBox: document.querySelector("#search-box"),
  body: document.querySelector("body"),
};

const DEBOUNCE_DELAY = 300;

elements.searchBox.addEventListener(
  "input",
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

function onInputSearch(e) {
  e.preventDefault();

  const searchCountries = e.target.value.trim();

  if (!searchCountries) {
    elements.countriesList.style.visibility = "hidden";
    elements.countryInfo.style.visibility = "hidden";
    elements.countriesList.innerHTML = "";
    elements.countryInfo.innerHTML = "";
    return;
  }

  fetchCountries(searchCountries)
    .then((result) => {
      if (result.length > 10) {
        Notify.info(
          "Too many matches found. Please, enter a more specific name."
        );
        return;
      }

      renderedCountries(result);
    })
    .catch((error) => {
      elements.countriesList.innerHTML = "";
      elements.countryInfo.innerHTML = "";
      Notify.failure("Oops, there is no country with that name");
    });
}

function renderedCountries(result) {
  const inputLetters = result.length;

  if (inputLetters === 1) {
    elements.countriesList.innerHTML = "";
    elements.countriesList.style.visibility = "hidden";
    elements.countryInfo.style.visibility = "visible";
    countryCardMarkup(result);
  } else if (inputLetters > 1 && inputLetters <= 10) {
    elements.countryInfo.innerHTML = "";
    elements.countryInfo.style.visibility = "hidden";
    elements.countriesList.style.visibility = "visible";
    countriesListMarkup(result);
  }
}

function countriesListMarkup(result) {
  const listMarkup = result
    .map(({ name, flags }) => {
      return `<li> <img src="${flags.svg}" alt="${name}" width="60" height="auto"> <span>${name.official}</span> </li>`;
    })
    .join("");
  elements.countriesList.innerHTML = listMarkup;
  return listMarkup;
}

function countryCardMarkup(result) {
  const cardMarkup = result
    .map(({ flags, name, capital, population, languages }) => {
      languages = Object.values(languages).join(", ");
      return `<img src="${flags.svg}" alt="${name}" width="320" height="auto"> <p>${name.official}</p> <p>Capital: <span>${capital}</span></p> <p>Population: <span>${population}</span></p> <p>Languages: <span>${languages}</span></p>`;
    })
    .join("");
  elements.countryInfo.innerHTML = cardMarkup;
  return cardMarkup;
}
