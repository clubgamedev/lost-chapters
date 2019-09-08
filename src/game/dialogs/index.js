import { franck } from "./Franck";
import { augustin } from "./Augustin";
import { marie } from "./SoeurMarie";
import { arthur } from "./PereArthur";

import { Marchand } from "./Marchand";
import { ramsey } from "./Ramsey";
import { SbireForest } from "./SbireForest";
import { SbireGardantGrotte } from "./SbireGardantGrotte";

import { SbireMinable } from "./SbireMinable";
import { StudentLambda } from "./StudentLambda";
import { Therled } from "./Therled";
import { GardeDeTherled } from "./GardeDeTherled";
import {
    etudiant_salle_a_manger,
    etudiant_dortoir,
    etudiant_salle_astonomie
} from "./etudiants";

import * as descriptions from "./descriptions";

export const dialogs = {
    franck,
    augustin,
    marie,
    arthur,
    Marchand,
    ramsey,
    SbireForest,
    SbireGardantGrotte,
    SbireMinable,
    StudentLambda,
    Therled,
    GardeDeTherled,
    etudiant_salle_a_manger,
    etudiant_dortoir,
    etudiant_salle_astonomie,
    ...descriptions
}
