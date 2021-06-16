export interface Cue {
  actor?: string;
  avatar?: string;
  text: string;
  start?: number;
  end: number;
}

export interface Stage {
  label?: string;
  videoId: string;
  speech: Cue[];
}

export interface Styles {
  [key: string]: any;
}

export interface Avatars {
  location: string;
  files: {[key: string]: string};
}

export interface SceneModel {
  avatars: Avatars;
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
