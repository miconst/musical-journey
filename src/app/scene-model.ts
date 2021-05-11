export interface Cue {
  actor?: string;
  text: string;
  start?: number;
  end: number;
}

export interface Stage {
  videoId: string;
  speech: Cue[];
}

export interface Styles {
  [key: string]: any;
}

export interface SceneModel {
  styles: Styles;
  header: {
    label: string;
    styles: Styles;
  };
  footer: {
    label: string;
    styles: Styles;
  };
  video: {
    width: number;
    height: number;
    styles: Styles;
  };
  play: Stage[];
}
