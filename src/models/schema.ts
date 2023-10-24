const mongoose = require('mongoose');
//const Joi = require('joi-oid');

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

export const Book = mongoose.model('book', bookSchema);
export const Author = mongoose.model('author', authorSchema);
