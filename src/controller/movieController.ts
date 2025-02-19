import {Request, Response} from 'express';
import {fetchMoviesByYear, fetchMovieEditors} from '../service/movieService';

// Controller to handle fetching movies by year.
export const getMoviesByYear = async (req: Request, res: Response) => {
    const {year} = req.params;

    try {
        const movies = await fetchMoviesByYear(year);

        const moviesWithEditors = await Promise.all(
            movies.map(async (movie: any) => {
                const editors = await fetchMovieEditors(movie.id);
                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    editors: editors
                };
            })
        );

        res.json(moviesWithEditors);
    } catch (error) {
        console.error('Error requesting movies:', error);
        res.status(500).json({error: 'Failed to fetch movies'});
    }
};
