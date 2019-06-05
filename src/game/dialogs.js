
import { franck } from "./dialogs/Franck";
import { augustin } from "./dialogs/Augustin";
import { SoeurMarie } from "./dialogs/SoeurMarie";
import { PereArthur } from "./dialogs/PereArthur";

import { Marchand } from "./dialogs/Marchand";
import { Ramsey } from "./dialogs/Ramsey";
import { SbireForest } from "./dialogs/SbireForest";
import { SbireGardantGrotte } from "./dialogs/SbireGardantGrotte";

import { SbireMinable } from "./dialogs/SbireMinable";
import { StudentLambda } from "./dialogs/StudentLambda";
import { Therled } from "./dialogs/Therled";
import { GardeDeTherled } from "./dialogs/GardeDeTherled";
import {
    etudiant_salle_a_manger,
    etudiant_dortoir,
    etudiant_salle_astonomie
} from "./dialogs/etudiants";

import { book_intro } from "./books/book_intro";
import { book_library } from "./books/book_library";
import { book_franck } from "./books/book_franck";

import { secret } from "./pages/secret";
import { messagePourRamsey } from "./pages/messagePourRamsey";
import { conseilDeFranck } from "./pages/conseilDeFranck";


export const dialogs = {
    franck,
    augustin,
    SoeurMarie,
    PereArthur,
    Marchand,
    Ramsey,
    SbireForest,
    SbireGardantGrotte,
    SbireMinable,
    StudentLambda,
    Therled,
    GardeDeTherled,
    etudiant_salle_a_manger,
    etudiant_dortoir,
    etudiant_salle_astonomie
}

export const books = {
    book_library,
    book_franck,
    book_intro
}

export const pages = {
    secret,
    messagePourRamsey,
    conseilDeFranck
}