import { messagePourRamsey } from "./messagePourRamsey";
import * as pages_universite from "./pages_universite"
import * as pages_recettes from "./recettes";

export const pages = {
    ...pages_universite,
    ...pages_recettes,
    messagePourRamsey,
}