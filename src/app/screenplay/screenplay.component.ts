// tslint:disable: variable-name
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Cue } from '../scene-model';

type Line = Required<Cue> & {
  index: number;
};

interface ScreenplayItem {
  actor: string;
  lines: Line[];
}

function isElementInViewport(view: HTMLElement, elem: HTMLElement): boolean {
  const viewRc = view.getBoundingClientRect();
  const elemRc = elem.getBoundingClientRect();

  return viewRc.left <= elemRc.left && elemRc.right <= viewRc.right &&
    viewRc.top <= elemRc.top && elemRc.bottom <= viewRc.bottom;
}

function makeScreenplay(speech: ReadonlyArray<Cue>): ScreenplayItem[] {
  const play: ScreenplayItem[] = [];
  let next: ScreenplayItem = { actor: '', lines: [] };
  let start = 0;
  let avatar = '';
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
      avatar = '';
    }

    if (line.start) {
      start = line.start;
    }
    start = line.end;

    if (line.avatar) {
      avatar = line.avatar;
    }

    next.lines.push({ ...line, actor, avatar, start, index: i });
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
  @ViewChildren('item') itemList?: QueryList<ElementRef<HTMLElement>>;

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

          // Give Angular a chance finish the update then scroll selected item into the view.
          const item = this.screenplay[i].lines[value];
          setTimeout(() => this.scrollItemIntoView(item.index), 50);
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

  @Input() avatarDir = 'assets';

  @Input() viewport?: HTMLElement;

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

  getAvatarUrl(index: number): string {
    let url = this.screenplay[index].lines[0].avatar;
    if (url) {
      url = `url("${this.avatarDir}/${url}")`;
    }
    return url;
  }

  scrollItemIntoView(index: number): void {
    const elem = this.itemList?.toArray()[index]?.nativeElement;
    if (elem && typeof elem.scrollIntoView === 'function') {
      if (!(this.viewport && isElementInViewport(this.viewport, elem))) {
        elem.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      }
    }
  }
}
