var persona1 = {
    nombre: "mateo",
    apellido: "ferrari",
    edad: 19,
    colores: ["blanco", "negro", "naranja"],
    dni: 46927005
};
var persona2 = {
    nombre: "tomasito",
    apellido: "lizzi",
    edad: 16,
    colores: ["rojo", "azul", "verde"],
    dni: 46927014
};
function calcular(persona1, persona2) {
    if (persona1.edad > persona2.edad) {
        console.log(persona1.nombre + " es mayor que " + persona2.nombre)
        for (let i = 0; i < persona1.colores.length; i++) {
            if (persona1.colores == 'azul') {
                console.log("y le gusta el color azul");
                break;
            }
        }
    }
       else { console.log(persona2.nombre + " es mayor que " + persona1.nombre)
    for (let i = 0; i < persona2.colores.length; i++) {
     if (persona2.colores == 'azul') {
        console.log("y le gusta el color azul");
        break;
      }
    }
    return calcular;
}
}
calcular(persona1, persona2);