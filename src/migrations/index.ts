import * as migration_20261119_140936_inicial from './20261119_140936_inicial';

export const migrations = [
  {
    up: migration_20261119_140936_inicial.up,
    down: migration_20261119_140936_inicial.down,
    name: '20261119_140936_inicial'
  },
];
