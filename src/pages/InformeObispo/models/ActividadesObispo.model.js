import { ConcentracionesDistrito } from "./ConcentracionesDistrito.model";
import { ConferenciasDistrito } from "./ConferenciasDistrito.model";
import { CultosDistrito } from "./CultosDistrito.model";
import { VisitasObispo } from "./VisitasObispo.model";

export class ActividadesObispo{
    visitasObispo = new VisitasObispo();
    cultosDistrito = new CultosDistrito();
    conferenciasDistrito = new ConferenciasDistrito();
    concentracionesDistrito = new ConcentracionesDistrito();
}