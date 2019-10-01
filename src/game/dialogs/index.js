import { franck } from "./Franck";
import { augustin } from "./Augustin";
import { marie } from "./SoeurMarie";
import { arthur } from "./PereArthur";

import { Marchand } from "./Marchand";
import { ramsey } from "./Ramsey";

import { therled } from "./Therled";
import {
    etudiant_salle_a_manger,
    etudiant_dortoir,
    etudiant_salle_astonomie
} from "./etudiants";
import {
    ennemy_cultist
} from "./sbires";

import * as descriptions from "./descriptions";

export const dialogs = {
    franck,
    augustin,
    marie,
    arthur,
    Marchand,
    ramsey,
    therled,
    etudiant_salle_a_manger,
    etudiant_dortoir,
    etudiant_salle_astonomie,
    ennemy_cultist,
    ...descriptions
}
