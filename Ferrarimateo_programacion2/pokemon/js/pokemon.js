let equipo1 = [], equipo2 = [], dado1 = 0, dado2 = 0;

// Obtiene Pokémon por ID
const obtenerPokemon = async id => (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();

// Pokémon aleatorio 
const pokemonAleatorio = async () => await obtenerPokemon(Math.floor(Math.random() * 898) + 1);

// Tira dado de 6 caras
const tirarDado = () => Math.floor(Math.random() * 6) + 1;


const manejarTiradasEquipo = numero => {
    let intentos = 0, mayorDado = 0;
    const resultados = document.getElementById(`resultadosDado${numero}`);
    resultados.innerHTML = "";
    return () => {
        if (intentos++ < 3) {
            const valor = tirarDado();
            resultados.innerHTML += `<p>Equipo ${numero} - Tirada ${intentos}: ${valor}</p>`;
            mayorDado = Math.max(mayorDado, valor);
            if (intentos === 3) {
                document.getElementById(`botonTirarDado${numero}`).disabled = true;
                numero === 1 ? dado1 = mayorDado : dado2 = mayorDado;
                verificarTiradas();
            }
        }
    };
};

const verificarTiradas = () => {
    if (dado1 && dado2) {
        if (dado1 === dado2) {
            const r1 = document.getElementById('resultadosDado1'), r2 = document.getElementById('resultadosDado2');
            dado1 = tirarDado(); dado2 = tirarDado();
            r1.innerHTML += `<p>Empate, Equipo 1 - Extra: ${dado1}</p>`;
            r2.innerHTML += `<p>Empate, Equipo 2 - Extra: ${dado2}</p>`;
            dado1 === dado2 ? verificarTiradas() : document.getElementById('botonGenerarEquipos').style.display = 'block';
        } else document.getElementById('botonGenerarEquipos').style.display = 'block';
    }
};

// Genera equipo de 3 Pokémon
const generarEquipo = async numero => {
    const lista = document.getElementById(`listaEquipo${numero === 1 ? 'Uno' : 'Dos'}`);
    const titulo = document.getElementById(`TituloEquipo${numero === 1 ? 'Uno' : 'Dos'}`);
    if (!lista || !titulo) return console.error(`Error en Equipo ${numero}`);
    lista.innerHTML = ""; titulo.innerHTML = `Equipo ${numero}`;
    const equipo = [];
    for (let i = 0; i < 3; i++) {
        const p = await pokemonAleatorio();
        equipo.push({ nombre: p.name, imagen: p.sprites.front_default, stats: {
            hp: p.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
            attack: p.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
            defense: p.stats.find(s => s.stat.name === 'defense')?.base_stat || 0
        }});
        lista.innerHTML += `<li><img src="${p.sprites.front_default}" alt="${p.name}" width="50">${p.name}<br>Vida: ${equipo[i].stats.hp}<br>Ataque: ${equipo[i].stats.attack}<br>Defensa: ${equipo[i].stats.defense}<br></li>`;
    }
    numero === 1 ? equipo1 = equipo : equipo2 = equipo;
};

// Calcula daño
const calcularDaño = (ataque, defensa) => Math.max(0, ataque - defensa / 2);

// Determina ganador
const determinarGanadorEquipo = (e1, e2) => {
    const a1 = e1.reduce((s, p) => s + p.stats.attack, 0), d1 = e1.reduce((s, p) => s + p.stats.defense, 0);
    const a2 = e2.reduce((s, p) => s + p.stats.attack, 0), d2 = e2.reduce((s, p) => s + p.stats.defense, 0);
    const daño1 = calcularDaño(a2, d1), daño2 = calcularDaño(a1, d2);
    const def1 = Math.max(0, d1 - daño1), def2 = Math.max(0, d2 - daño2);
    document.getElementById('resultadosCombate').innerHTML = `<h3>Resultados:</h3><p>Equipo 1: Ataque ${a1}, Defensa ${d1}</p><p>Equipo 2: Ataque ${a2}, Defensa ${d2}</p><p>Equipo 1: Daño ${daño1}, Defensa restante ${def1}</p><p>Equipo 2: Daño ${daño2}, Defensa restante ${def2}</p>`;
    const titulo = document.getElementById('TituloEquipoGanador'), lista = document.getElementById('listaEquipoGanador');
    lista.innerHTML = "";
    const ganador = def1 > def2 ? [1, e1] : def1 < def2 ? [2, e2] : dado1 > dado2 ? [1, e1] : dado2 > dado1 ? [2, e2] : [0, []];
    titulo.innerHTML = ganador[0] ? `¡Equipo ${ganador[0]} GANADOR${ganador[0] && def1 === def2 ? " por dados" : ""}!` : "¡EMPATE!";
    ganador[1].forEach(p => lista.innerHTML += `<li><img src="${p.imagen}" alt="${p.nombre}" width="30"> ${p.nombre}</li>`);
    document.getElementById('contenedorGanadorEquipo').style.display = 'block';
};

// Botones
document.getElementById('botonTirarDado1').addEventListener('click', manejarTiradasEquipo(1));
document.getElementById('botonTirarDado2').addEventListener('click', manejarTiradasEquipo(2));
document.getElementById('botonGenerarEquipos').addEventListener('click', async () => {
    const l = document.getElementById('loadingMessage');
    l.style.display = 'block';
    document.getElementById('botonGenerarEquipos').disabled = true;
    await generarEquipo(1); await generarEquipo(2);
    l.style.display = 'none';
    document.getElementById('botonGenerarEquipos').disabled = false;
    document.getElementById('botonBatallar').style.display = 'block';
});
document.getElementById('botonBatallar').addEventListener('click', () => determinarGanadorEquipo(equipo1, equipo2));