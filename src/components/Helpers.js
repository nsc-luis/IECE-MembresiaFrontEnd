const helpers = {
    // EXPRESIONES REGULARES
    regex: {
        alphaSpaceRequired: /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
        formatoEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        formatoTelefono: /^(\+\d{1,3})*(\(\d{2,3}\))*\d{7,25}$/,
        formatoPassword: /^(?=.{6,20}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*/
    },

    // MENSAJES PARA RegEx INCORRECTOS
    msjRegexInvalido: {
        emailInvalido: 'Formato incorrecto. Ej: buzon@dominio.com.',
        fechaBautismoInvalida: 'Formato admintido: dd/mm/aaaa.',
        fechaBodaCivilInvalida: 'Formato admintido: dd/mm/aaaa.',
        fechaEspitiruSantoInvalida: 'Formato admintido: dd/mm/aaaa.',
        fechaBodaEclesiasticaInvalida: 'Formato admintido: dd/mm/aaaa.',
        telMovilInvalido: 'Formatos admintidos: +521234567890, +52(123)4567890, (123)4567890, 1234567890. Hasta 25 numeros sin espacios.',
        confirmaPassInvalido: 'Las contraseñas no coinciden.'
    },

    // URLs PARA PRUEBA
    url_api: "http://" + window.location.hostname + ":59239/api",
    //url_api : "http://" + window.location.hostname + "/webapi/api",

    // METODO PARA VALIDAR CAMPOS
    validaFormatos: function (formato, campo) {
        if (formato.test(campo)) {
            return false;
        } else {
            return true;
        }
    }
}

export default helpers;