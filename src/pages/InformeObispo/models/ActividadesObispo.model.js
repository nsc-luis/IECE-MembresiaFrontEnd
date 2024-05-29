import { ConcentracionesDistrito } from "./ConcentracionesDistrito.model";
import { ConferenciasDistrito } from "./ConferenciasDistrito.model";
import { CultosDistrito } from "./CultosDistrito.model";
import { VisitasObispo } from "./VisitasObispo.model";

export class ActividadesObispo{
    VisitasObispo = new VisitasObispo();
    CultosDistrito = new CultosDistrito();
    ConferenciasDistrito = new ConferenciasDistrito();
    ConcentracionesDistrito = new ConcentracionesDistrito();
}