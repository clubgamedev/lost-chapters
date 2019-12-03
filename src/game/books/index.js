import { book_intro } from "./book_intro";
import { book_escape } from "./book_escape";
import * as books_universite from "./books_universite";

export const books = {
    ...books_universite,
    book_intro,
    book_escape
}