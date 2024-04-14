const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function addItems(itemType, title, authorDirector, isbn, category, publisherProducer, publicationReleaseDate,imageLink) {
    if(itemType === 'book') {
        connection.query(`INSERT INTO author (author_name) VALUES (?)`, [authorDirector], (err) => { 
            if (err) {
                console.log('error entering new author into librarydev db:', err);
            }
            else {
                connection.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
                    if (err) {
                        console.log('error getting new author id:', err);
                    }
                    else {
                        const authorId = result[0]['LAST_INSERT_ID()'];
                    }
                })
            }
        }),
        connection.query(`INSERT INTO genres (genre_name) VALUES (?)`, [category], (err) => { 
            if (err) {
                console.log('error entering new genre into librarydev db:', err);
            }
            else {
                connection.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
                    if (err) {
                        console.log('error getting new genre id:', err);
                    }
                    else {
                        const genreId = result[0]['LAST_INSERT_ID()'];
                    }
                })
                connection.query(`INSERT INTO book (isbn,title,year_released,book_img_address) VALUES (?,?,?,?)`, [isbn,title,publicationReleaseDate,imageLink], (err) => { 
                    if (err) {
                        console.log('error entering new book into librarydev db:', err);
                    }
                }),
                connection.query(`INSERT INTO book_author_link (isbn,author_id) VALUES ()`, [isbn,authorId], (err) => { 
                    if (err) {
                        console.log('error entering new book_id into librarydev db:', err);
                    }
                }),
                connection.query(`INSERT INTO book_genres_link (isbn,genre_id) VALUES ()`, [isbn,genreId], (err) => { 
                    if (err) {
                        console.log('error entering new genre_id into librarydev db:', err);
                    }
                })
            }
        })
    }
    else if (itemType === 'movie') {
        connection.query(`INSERT INTO genres (genre_name) VALUES (?)`, [category], (err) => { 
            if (err) {
                console.log('error entering new genre into librarydev db:', err);
            }
            else {
                connection.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
                    if (err) {
                        console.log('error getting new genre id:', err);
                    }
                    else {
                        const genreId = result[0]['LAST_INSERT_ID()'];
                    }
                }),
                connection.query(`INSERT INTO movie (movie_id,movie_title,director,year_released,movie_img_address) VALUES (?,?,?,?,?)`, [isbn,title,authorDirector,publicationReleaseDate,imageLink], (err) => { 
                    if (err) {
                        console.log('error entering new movie into librarydev db:', err);
                    }
                }),
                connection.query(`INSERT INTO movie_genres_link (isbn,genre_id) VALUES ()`, [isbn,genreId], (err) => { 
                    if (err) {
                        console.log('error entering new genre_id into librarydev db:', err);
                    }
                })
            }
        })
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'eventCreationSuccessful' }));
    };

    module.exports = { addItems };