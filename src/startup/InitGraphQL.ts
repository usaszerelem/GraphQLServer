import { Application } from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import _ from 'lodash';
import { Author, Book } from '../models/schema';

export function InitGraphQL(app: Application) {
    /*
    const books = [
        { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
        { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
        { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
        { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
        { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
        { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
    ];

    const authors = [
        { name: 'Patrick Rothfuss', age: 44, id: '1' },
        { name: 'Brandon Sanderson', age: 42, id: '2' },
        { name: 'Terry Pratchett', age: 66, id: '3' },
    ];
    */

    const BookType: any = new GraphQLObjectType({
        name: 'Book',
        fields: () => ({
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            genre: { type: GraphQLString },
            author: {
                type: AuthorType,
                resolve(parent, _args) {
                    console.log(`Resolve parent:` + JSON.stringify(parent, null, 2));
                    // code to get data from db / other source
                    // return _.find(authors, { id: parent.authorId });
                    return Author.findById(parent.authorId);
                },
            },
        }),
    });

    const AuthorType: any = new GraphQLObjectType({
        name: 'Author',
        fields: () => ({
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            age: { type: GraphQLInt },
            books: {
                type: new GraphQLList(BookType),
                resolve(parent, _args) {
                    // return _.filter(books, { authorId: parent.id });
                    return Book.find({ authorId: parent.id });
                },
            },
        }),
    });

    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: () => ({
            book: {
                type: BookType,
                args: {
                    id: { type: GraphQLID },
                },
                resolve(_parent, args) {
                    // code to get data from db / other source
                    // return _.find(books, { id: args.id });

                    return Book.findById(args.id);
                },
            },
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLID },
                },
                resolve(_parent, args) {
                    // code to get data from db / other source
                    // return _.find(authors, { id: args.id });
                    return Author.findById(args.id);
                },
            },
            books: {
                type: new GraphQLList(BookType),
                resolve(_parent, _args) {
                    // return books;
                    return Book.find({});
                },
            },
            authors: {
                type: new GraphQLList(AuthorType),
                resolve(_parent, _args) {
                    // return authors;
                    return Author.find({});
                },
            },
        }),
    });

    const Mutation = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addAuthor: {
                type: AuthorType,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    age: { type: new GraphQLNonNull(GraphQLInt) },
                },
                resolve(_parent, args) {
                    const author = new Author({
                        name: args.name,
                        age: args.age,
                    });

                    return author.save();
                },
            },
            addBook: {
                type: BookType,
                args: {
                    name: { type: new GraphQLNonNull(GraphQLString) },
                    genre: { type: new GraphQLNonNull(GraphQLString) },
                    authorId: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(_parent, args) {
                    const book = new Book({
                        name: args.name,
                        genre: args.genre,
                        authorId: args.authorId,
                    });

                    return book.save();
                },
            },
        },
    });

    const schema = new GraphQLSchema({
        query: RootQuery,
        mutation: Mutation,
    });

    app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
}
