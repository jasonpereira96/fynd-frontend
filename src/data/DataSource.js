import axios from 'axios';
import ErrorHandler from './../components/ErrorHandler';
class DataSource {
    constructor() {
        this.URL = 'http://localhost:3001';
    }
    getData() {

        /*
        {
                "99popularity": 83.0,
                "director": "Victor Fleming",
                "genre": [
                    "Adventure",
                    "Family",
                    "Fantasy",
                    "Musical"
                ],
                "imdb_score": 8.3,
                "name": "The Wizard of Oz"
            }
        */
        const { URL } = this;
        return axios.get(`${URL}/data`, {}).then(response => response.data);

    }
    getGenres() {

        const { URL } = this;
        return axios.get(`${URL}/genres`, {}).then(result => {
            result.data.sort((a, b) => a.name.localeCompare(b.name));
            return result.data;
        });
    }
    deleteRecord(recordId) {
        const { URL } = this;
        return axios.post(`${URL}/delete`, {
            id: recordId
        }).then(result => result.data);
    }
    addRecord(record) {
        const { URL } = this;
        // record.imdb_score = record.imdbScore;
        // delete record.imdbScore;
        if (Array.isArray(record.genreIds)) {
            record.genreIds = JSON.stringify(record.genreIds);
        }
        return axios.post(`${URL}/add`, record).then(response => response.data);
    }
    updateRecord(recordId, fields) {
        const { URL } = this;
        const NULL = 'NULL';

        const keys = ['name', 'imdb_score', 'popularity', 'genreIds', 'director'];

        for (var key of keys) {
            if (fields[key] === undefined) {
                fields[key] = NULL;
            }
        }
        fields.id = recordId;

        if (fields.genreIds !== NULL) {
            fields.genreIds = JSON.stringify(fields.genreIds);
        }

        return axios.post(`${URL}/update`, fields).then(response => response.data);

        /*
        99popularity: 88
        director: "George Lucas"
        genre: (4) ["Action", "Adventure", "Fantasy", "Sci-Fi"]
        genres: "Action, Adventure, Fantasy, Sci-Fi"
        id: 1
        imdb_score: 8.8
        name: "Star Wars"
        popularity: 88
        */
    }
    verifyCredentials({ username, password }) {
        const { URL } = this;
        return axios.post(`${URL}/credentials`, {
            username, password
        }).then(function (result) {
            return result.data;
        });
    }
    addGenre(genre) {
        const { URL } = this;

        if (!genre || genre === '') {
            return new Promise(function (resolve, reject) {
                reject('invalid genre: cannot be empty');
            });
        }
        return axios.post(`${URL}/addgenre`, {
            genre: genre
        }).then(function (response) {
            return response.data;
        });
    }
}

export default DataSource;


