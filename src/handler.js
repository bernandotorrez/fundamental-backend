/* eslint-disable max-len */
const {
    v4: uuidv4
} = require('uuid');
const books = require('./books');
const {
    addBookValidation,
    editBookValidation
} = require('./validations');

const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const validation = addBookValidation({
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    });
    let response;

    if (validation.error) {
        response = h.response({
            status: 'fail',
            message: validation.error.details[0].message,
        }).code(400);
    } else if (readPage > pageCount) {
        response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    } else {
        const id = uuidv4();
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = (pageCount === readPage);

        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            finished,
            insertedAt,
            updatedAt,
        };

        books.push(newBook);

        const isSuccess = books.filter((book) => book.id === id).length > 0;

        if (isSuccess) {
            response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            }).code(201);
        } else {
            response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku',
            }).code(500);
        }
    }

    return response;
};

const getAllBooksHandler = (request, h) => {
    const {
        reading,
        finished,
        name
    } = request.query;
    let data;

    if (typeof name !== 'undefined') {
        const arraySearch = [];
        books.filter((book) => {
            const words = book.name.split(' ');
            words.map((word) => {
                if (word.toLowerCase() == name.toLowerCase()) {
                    arraySearch.push(book);
                }
            });
        });

        const result = []
        arraySearch.map((n) => {
            result.push({
                id: n.id,
                name: n.name,
                publisher: n.publisher
            });
        });

        data = result;
    } else if (typeof reading !== 'undefined') {
        const result = []
        const arraySearch = books.filter((book) => book.reading == (reading == 1));

        arraySearch.map((n) => {
            result.push({
                id: n.id,
                name: n.name,
                publisher: n.publisher
            });
        });

        data = result;
    } else if (typeof finished !== 'undefined') {
        const result = []
        const arraySearch = books.filter((book) => book.finished == (finished == 1));

        arraySearch.map((n) => {
            result.push({
                id: n.id,
                name: n.name,
                publisher: n.publisher
            });
        });

        data = result;
    } else {
        data = [];
        books.map((n) => {
            data.push({
                id: n.id,
                name: n.name,
                publisher: n.publisher
            });
        });
    }

    const response = h.response({
        status: 'success',
        data: {
            books: data,
        },
    }).code(200);

    return response;
};

const getBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    let response;
    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        response = h.response({
            status: 'success',
            data: {
                book,
            },
        }).code(200);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return response;
};

const editBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const finished = (pageCount === readPage);

    const validation = editBookValidation({
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    });

    let response;

    if (validation.error) {
        response = h.response({
            status: 'fail',
            message: validation.error.details[0].message,
        }).code(400);
    } else if (readPage > pageCount) {
        response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    } else {
        const index = books.findIndex((book) => book.id === id);
        if (index !== -1) {
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                finished,
                updatedAt,
            };

            response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            }).code(200);
        } else {
            response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            }).code(404);
        }
    }

    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const index = books.findIndex((book) => book.id === id);
    let response;
    if (index !== -1) {
        books.splice(index, 1);
        response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
        response.code(200);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    return response;
};

const indexHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        message: 'Welcome di books API Bernand',
    });
    response.code(200);
    return response;
};

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
    indexHandler,
};
