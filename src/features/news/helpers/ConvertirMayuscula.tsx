import { INoticias } from "../types";

export const toUpperCase: (objeto: INoticias) => string = (objeto) => {

    return objeto.titulo
        .split(" ")
        .map((str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        })
        .join(" ");
};