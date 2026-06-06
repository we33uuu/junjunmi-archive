export enum AppPhase {
  WELCOME = 'welcome',
  CUBE = 'cube',
  GALLERY = 'gallery',
  FINALE = 'finale'
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}
