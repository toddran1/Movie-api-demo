import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get movies for a given year
export const fetchMoviesByYear = async (year: string): Promise<any[]> => {
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

        return moviesResponse.data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
    }
};

// Get movie credits and editors
export const fetchMovieEditors = async (movieId: number): Promise<string[]> => {
    try {
        const creditsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        return creditsResponse.data.crew
            .filter((person: any) => person.known_for_department === 'Editing')
            .map((person: any) => person.name);
    } catch (error) {
        console.error(`Failed to fetch credits for movie ID ${movieId}:`, error);
        return []; // return empty array if API call fails
    }
};
