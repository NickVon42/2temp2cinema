import { title } from "process";
import internal from "stream";


class Movie {
    title: string
    rating: number
    description: string
    poster: string

  constructor(
    title: string, 
    rating: number, 
    description: string, 
    poster: string
) {
    this.title = title
    this.rating = rating
    this.description = description
    this.poster = poster
  }

}

let movie: Movie


const fetchMovie = async () => {
  const response = await fetch('https://api.themoviedb.org/3/search/movie?api_key=38c1d80950e65630e084362d93a2f134&language=en-US&query=anomalisa&page=1&include_adult=true').then(response => response.json());
  const i = response.results[0]
  movie = new Movie(i.title, i.vote_average, i.overview, 'https://www.themoviedb.org/t/p/w1280'.concat(i.poster_path))
  console.log(movie.rating)
  return movie
}
let name: string
fetchMovie().then(()=>{
name = movie.title

})
// movie.results[0].title = fetchMovie()


export {name}

