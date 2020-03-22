import * as books_intro_outro from "./book_intro_outro";
import { book_escape } from "./book_escape";
import * as books_universite from "./books_universite";

export const books = {
    ...books_universite,
    ...books_intro_outro,
    book_escape
}