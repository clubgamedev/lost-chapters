import { messagePourRamsey } from "./messagePourRamsey";
import { page_astro_tindalos } from "./pages_universite"
import * as pages_recettes from "./recettes";

export const pages = {
    ...pages_recettes,
    messagePourRamsey,
    page_astro_tindalos
}