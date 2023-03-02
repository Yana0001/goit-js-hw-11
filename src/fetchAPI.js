import axios from 'axios';
async function fetchImages(name, page, perPage) {
  const baseURL = 'https://pixabay.com/api/';
  const key = '34017776-ded978fe1695c8af60f3084ce';
  const response = await axios.get(
    `${baseURL}?key=${key}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
export { fetchImages };
