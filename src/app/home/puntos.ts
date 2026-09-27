export interface PuntoMapa {
  nombre: string;
  coords: [number, number];
  icono: string;
}

/** Los 20 lugares fijos de la actividad: nombre, coordenadas e icono del marcador. */
export const PUNTOS_MAPA: PuntoMapa[] = [
  {
    nombre: 'ETITC',
    coords: [4.606449, -74.081320],
    icono: 'assets/iconos-lugares/universidad.svg',
  },
  {
    nombre: 'Paseo Villa del Río',
    coords: [4.5986681533919125, -74.15283556979202],
    icono: 'assets/iconos-lugares/centro-comercial.svg',
  },
  {
    nombre: 'Mi trabajo',
    coords: [4.578493376487337, -74.08508909566551],
    icono: 'assets/iconos-lugares/trabajo.svg',
  },
  {
    nombre: 'Iglesia',
    coords: [4.615070026071022, -74.13241721720863],
    icono: 'assets/iconos-lugares/iglesia.svg',
  },
  {
    nombre: 'Titán Plaza',
    coords: [4.694921852049054, -74.08611290225188],
    icono: 'assets/iconos-lugares/centro-comercial.svg',
  },
  {
    nombre: 'Casa de mi mejor amigo',
    coords: [4.620527278832107, -74.07487234379666],
    icono: 'assets/iconos-lugares/casa.svg',
  },
  {
    nombre: 'KFC Centro',
    coords: [4.601051866596195, -74.07230538242604],
    icono: 'assets/iconos-lugares/restaurante.svg',
  },
  {
    nombre: 'Floristería',
    coords: [4.604872095870667, -74.15428601236356],
    icono: 'assets/iconos-lugares/floristeria.svg',
  },
  {
    nombre: 'Tortas',
    coords: [4.604322163251368, -74.153499322715],
    icono: 'assets/iconos-lugares/pasteleria.svg',
  },
  {
    nombre: 'Universidad INCCA',
    coords: [4.615304394177628, -74.07751394643151],
    icono: 'assets/iconos-lugares/universidad.svg',
  },
  {
    nombre: 'Estación Ciudad Jardín',
    coords: [4.581686959229117, -74.0903273869093],
    icono: 'assets/iconos-lugares/estacion.svg',
  },
  {
    nombre: 'Museo del Oro',
    coords: [4.602045107259259, -74.07209221312227],
    icono: 'assets/iconos-lugares/museo.svg',
  },
  {
    nombre: 'Monserrate',
    coords: [4.6033374660907045, -74.0609972153931],
    icono: 'assets/iconos-lugares/montana.svg',
  },
  {
    nombre: 'Universidad Distrital',
    coords: [4.613807037289251, -74.06347629366566],
    icono: 'assets/iconos-lugares/universidad.svg',
  },
  {
    nombre: 'Estación de la Jiménez',
    coords: [4.605695539245254, -74.08174658104049],
    icono: 'assets/iconos-lugares/estacion.svg',
  },
  {
    nombre: 'Portal Sur',
    coords: [4.597553187366604, -74.16937291944653],
    icono: 'assets/iconos-lugares/bus.svg',
  },
  {
    nombre: 'Parque Timiza',
    coords: [4.609854563342518, -74.15212789707692],
    icono: 'assets/iconos-lugares/parque.svg',
  },
  {
    nombre: 'Alkosto',
    coords: [4.596796543620975, -74.13974544224607],
    icono: 'assets/iconos-lugares/supermercado.svg',
  },
  {
    nombre: "McDonald's",
    coords: [4.621359637452365, -74.15171698304239],
    icono: 'assets/iconos-lugares/restaurante.svg',
  },
  {
    nombre: 'Teddy Coffee',
    coords: [4.6015254700433434, -74.07396766061261],
    icono: 'assets/iconos-lugares/cafeteria.svg',
  },
];
