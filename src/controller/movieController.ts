import {Request, Response} from 'express';
import {fetchMoviesByYear, fetchMovieEditors} from '../service/movieService';
import {Movie} from '../models/movieModel';

// Controller to handle fetching movies by year
export const getMoviesByYear = async (req: Request, res: Response) => {
    const {year} = req.params;

    try {
        let movies: Movie[] = await fetchMoviesByYear(year);

        // Get editors for each movie
        movies = await Promise.all(
            movies.map(async (movie: Movie) => {
                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    editors: await fetchMovieEditors(movie?.id || 0)
                };
            })
        );
        
        res.json(movies);
    } catch (error) {
        console.error('Error requesting movies:', error);
        res.status(500).json({error: 'Failed to fetch movies'});
    }
};
