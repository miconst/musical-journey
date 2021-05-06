export interface Cue {
  actor?: string;
  text: string;
  start: number;
  end: number;
}

export interface Stage {
  videoId: string;
  speech: Cue[];
}

export interface SceneModel {
  name: string;
  play: Stage[];
}
