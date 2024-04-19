const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'library-database-sytem.mysql.database.azure.com',
    user: 'lbrGuest',
    password: 'gu3st@cces$',
    database: 'librarydev',
    port:3306
});

function getId(item, itemType) {
    return new Promise((resolve, reject) => {
        if(itemType === 'author') {
            connection.query(`SELECT author_id FROM author WHERE author_name = ?`, [item], (err, result) => {
                if (err) {
                    console.log('error getting author id:', err);
                    reject(err);
                }
                else {
                    if(result.length === 0){
                        resolve(0);
                    }
                    else {
                        console.log(result);
                        const Id = result[0]['author_id'];
                        console.log(Id);
                        resolve(Id);
                    }
                }
            })
        }
        else if(itemType === 'genre') {
            connection.query(`SELECT genre_id FROM genres WHERE genre_name = ?`, [item], (err, result) => {
                if (err) {
                    console.log('error getting genre id:', err);
                    reject(err);
                }
                else {
                    if(result.length === 0){
                        resolve(0);
                    }
                    else {
                        const Id = result[0]['genre_id'];
                        console.log(Id);
                        resolve(Id);
                    }
                }
            })
        }
    });
}


function addItems(res, itemType, title, authorDirector, isbn, category, publisherProducer, publicationReleaseDate,imageLink,totalCopies,rating) {
    if(itemType === 'book') {
        authorId = getId(authorDirector, 'author');
        console.log(authorId);
        if (authorId === 0) {
            console.log('author not found');
            connection.query(`INSERT INTO author (author_name) VALUES (?)`, [authorDirector], (err) => { 
                if (err) {
                    console.log('error entering new author into librarydev db:', err);
                }
                else {
                    authorId = getId(authorDirector, itemType);
                }
            })
        }
        genreId = getId(category, 'genre');
        if (genreId === 0 ) {
            console.log('genre not found');
            connection.query(`INSERT INTO genres (genre_name) VALUES (?)`, [category], (err) => {
                if (err) {
                    console.log('error entering new genre into librarydev db:', err);
                }
                else {
                    genreId = getId(category, itemType);
                }
            })
        }
        connection.query(`INSERT INTO book (total_copies,available_copies,current_holds,book_condition,isbn,title,year_released,book_img_address) VALUES (?,?,?,?,?,?,?,?)`, [totalCopies,totalCopies,'0','1',isbn,title,publicationReleaseDate,imageLink], (err) => { 
            if (err) {
                console.log('error entering new book into librarydev db:', err);
            }
        }),
        connection.query(`INSERT INTO book_author_link (book_id,author_id) VALUES (?,(SELECT author_id from author where author_name = ?))`, [isbn,authorDirector], (err) => { 
            if (err) {
                console.log('error entering new book_id into librarydev db:', err);
            }
        }),
        connection.query( `INSERT INTO book_genres_link (isbn,genre_id) VALUES (?,(SELECT genre_id from genres where genre_name = ?))`, [isbn,category], (err) => { 
            if (err) {
                console.log('error entering new genre_id into librarydev db:', err);
            }
        })
    }
    else if (itemType === 'movie') {
        genreId = getId(category, 'genre');
        if (genreId === 0 ) {
            console.log('genre not found');
            connection.query(`INSERT INTO genres (genre_name) VALUES (?)`, [category], (err) => {
                if (err) {
                    console.log('error entering new genre into librarydev db:', err);
                }
                else {
                    genreId = getId(category, itemType);
                }
            })
        }
        connection.query(`INSERT INTO movie (available_copies,total_copies,current_holds,movie_condition,rating,movie_id,movie_title,director,year_released,movie_img_address) VALUES (?,?,?,?,?,?,?,?,?,?)`, [totalCopies,totalCopies,'0','1',rating,isbn,title,authorDirector,publicationReleaseDate,imageLink], (err) => { 
            if (err) {
                console.log('error entering new movie into librarydev db:', err);
            }
        }),
        connection.query(`INSERT INTO movie_genres_link (movie_id,genre_id) VALUES (?,(SELECT genre_id from genres where genre_name = ?))`, [isbn,category], (err) => { 
            if (err) {
                console.log('error entering new genre_id into librarydev db:', err);
            }
        })
    }   

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'itemCreationSuccessful' }));
    };

    module.exports = { addItems };