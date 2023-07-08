import { INoticias } from "../types";
import { INoticiasNormalizadas } from "../types";

export const NoticiaFinal: (noticia: INoticias, tiempo: number, titulo: string) => INoticiasNormalizadas = (noticia, tiempo, titulo) => {
    return {
        id: noticia.id,
        titulo,
        descripcion: noticia.descripcion,
        fecha: `Hace ${tiempo} minutos`,
        esPremium: noticia.esPremium,
        imagen: noticia.imagen,
        descripcionCorta: noticia.descripcion.substring(0, 100)
    }
};