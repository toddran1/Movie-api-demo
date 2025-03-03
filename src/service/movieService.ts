import axios from 'axios';
import dotenv from 'dotenv';
import {Movie, Editor} from '../models/movieModel';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Fetch movies for a given year
export const fetchMoviesByYear = async (year: string): Promise<Movie[]> => {
    try {
        const moviesResponse = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1,
                primary_release_year: year,
                sort_by: 'popularity.desc'
            }
        });

        return moviesResponse.data.results
        .sort((a: Movie, b: Movie) => b.vote_average - a.vote_average)
        .map((movie: Movie) => ({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            editors: []
        }));
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
    }
};

// Fetch movie credits and editors
export const fetchMovieEditors = async (movieId: number): Promise<string[]> => {
    try {
        const creditsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        return creditsResponse.data.crew
            .filter((person: Editor) => person.known_for_department === 'Editing')
            .map((person: Editor) => person.name);
    } catch (error) {
        console.error(`Failed to fetch credits for movie ID ${movieId}:`, error);
        return []; // Return empty array if API call fails
    }
};
