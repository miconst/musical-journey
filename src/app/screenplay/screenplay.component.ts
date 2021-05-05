import { Component, Input, OnInit } from '@angular/core';

export interface ScreenplayItem {
  actor: string;
  lines: string[];
}

export interface ScreenplaySelection {
  actIndex: number;
  lineIndex: number;
}

@Component({
  selector: 'app-screenplay',
  templateUrl: './screenplay.component.html',
  styleUrls: ['./screenplay.component.scss']
})
export class ScreenplayComponent implements OnInit {
  @Input() items: ScreenplayItem[] = [
    {
      actor: 'Daddy',
      lines: [
        'Here\'s a toy', 'For my little boy.', 'A toy soldier for you', 'And his jacket is blue!'
      ]
    },
    {
      actor: 'William',
      lines: [
        'Thank you, Daddy!', 'He\'s very nice -', 'He\'s got dark hair', 'And big brown eyes!'
      ]
    },
    {
      actor: 'Daddy',
      lines: [
        'And what have I got', 'For my little Rose?', 'A ballerina -', 'She can dance on her toes!'
      ]
    },
    {
      actor: 'Rose',
      lines: [
        'Thank you, Daddy!', 'She\'s beautiful too!', 'She\'s got a pretty pink skirt', 'And pretty pink shoes!'
      ]
    },
  ];

  @Input() selection: ScreenplaySelection = {
    actIndex: -1,
    lineIndex: -1
  };

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(actIndex: number): void {
    this.selection = { actIndex, lineIndex: 0 };
  }

  onSubItemClick(actIndex: number, lineIndex: number): void {
    this.selection = { actIndex, lineIndex };
  }

  isItemSelected(actIndex: number): boolean {
    return !!this.selection && this.selection.actIndex === actIndex;
  }

  isSubItemSelected(actIndex: number, lineIndex: number): boolean {
    return !!this.selection && this.selection.actIndex === actIndex && this.selection.lineIndex === lineIndex;
  }
}
