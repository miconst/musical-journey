// tslint:disable: variable-name
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cue } from '../scene-model';

type Line = Required<Cue> & {
  index: number;
};

interface ScreenplayItem {
  actor: string;
  lines: Line[];
}

function makeScreenplay(speech: ReadonlyArray<Cue>): ScreenplayItem[] {
  const play: ScreenplayItem[] = [];
  let next: ScreenplayItem = { actor: '', lines: [] };
  let start = 0;
  for (let i = 0; i < speech.length; i++) {
    const line = speech[i];
    const actor = line.actor || next.actor;
    if (actor !== next.actor) {
      if (next.lines.length > 0) {
        play.push(next);
        next = { actor, lines: [] };
      } else {
        next.actor = actor;
      }
    }
    if (line.start) {
      start = line.start;
    }
    start = line.end;

    next.lines.push({ ...line, actor, start, index: i });
  }
  if (next.lines.length > 0) {
    play.push(next);
  }
  return play;
}

@Component({
  selector: 'app-screenplay',
  templateUrl: './screenplay.component.html',
  styleUrls: ['./screenplay.component.scss']
})
export class ScreenplayComponent implements OnInit {
  screenplay: ReadonlyArray<ScreenplayItem> = [];
  private _items: ReadonlyArray<Cue> = [];

  @Input() set items(value: ReadonlyArray<Cue>) {
    this._items = value;
    this.screenplay = makeScreenplay(value);
  }

  get items(): ReadonlyArray<Cue> {
    return this._items;
  }

  actIndex = -1;
  lineIndex = -1;
  private _selection = -1;

  @Input() set selection(value: number) {
    this._selection = value;
    this.actIndex = -1;
    this.lineIndex = -1;
    if (value >= 0) {
      for (let i = 0; i < this.screenplay.length; i++) {
        const length = this.screenplay[i].lines.length;
        if (value < length) {
          this.actIndex = i;
          this.lineIndex = value;
          break;
        } else {
          value -= length;
        }
      }
    }
  }

  get selection(): number {
    return this._selection;
  }

  @Output() selectionChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(actIndex: number): void {
    this.onSubItemClick(actIndex, 0);
  }

  onSubItemClick(actIndex: number, lineIndex: number): void {
    const line = this.screenplay[actIndex]?.lines[lineIndex];
    if (line) {
      this.selectionChange.emit(line.index);
    }
  }
}
