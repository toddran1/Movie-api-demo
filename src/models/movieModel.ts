// Movie object structure
export interface Movie {
    id?: number;
    title: string;
    release_date: string;
    vote_average: number;
    editors: string[];
}

// Editor object structure
export interface Editor {
    name: string;
    known_for_department: string;
}
