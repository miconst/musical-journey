// tslint:disable: variable-name
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SceneModel, Stage } from '../scene-model';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { ActivatedRoute } from '@angular/router';

const ASSETS_URL = 'assets/scenes/';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  stageIndex = -1;
  speechIndex = -1;
  scene?: SceneModel;
  errorMessage?: string;
  stageNames: string[] = [];

  @ViewChild('player') playerRef?: VideoPlayerComponent;

  get stage(): Stage | undefined  {
    return this.scene?.play[this.stageIndex];
  }

  constructor(private _http: HttpClient, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    const params = this._route.snapshot.queryParams;
    const game = (params.game as string || '').replace(/[^a-z\-_\.0-9]+/gmi, '') || 'toy';
    this._http
      .get<SceneModel>(ASSETS_URL + game + '.json')
      .toPromise()
      .then(data => this._setScene(data))
      .catch(error => this._onLoadError(error));
  }

  onVideoChange(currentTime: number): void {
    this.speechIndex = -1;
    const stage = this.scene?.play[this.stageIndex];
    if (stage) {
      for (let i = stage.speech.length; i-- > 0;) {
        const line = stage.speech[i];
        const start = line.start || stage.speech[i - 1].end || 0;
        if (start <= currentTime && currentTime < line.end) {
          this.speechIndex = i;
        }
      }
    }
  }

  onLineChange(speachIndex: number): void {
    this.speechIndex = speachIndex;
    const stage = this.scene?.play[this.stageIndex];
    const player = this.playerRef;
    if (stage && player) {
      const line = stage.speech[speachIndex];
      if (line) {
        const start = line.start || stage.speech[speachIndex - 1].end || 0;
        if (Math.abs(start - player.getCurrentTime()) > 0.05) {
          player.setCurrentTime(start);
        }
      }
    }
  }

  hasPrevStage(): boolean {
    const stage = this.scene?.play[this.stageIndex - 1];
    return !!stage;
  }

  onPrevStage(): void {
    if (this.hasPrevStage()) {
      this.setStage(this.stageIndex - 1);
    }
  }

  hasNextStage(): boolean {
    const stage = this.scene?.play[this.stageIndex + 1];
    return !!stage;
  }

  onNextStage(): void {
    if (this.hasNextStage()) {
      this.setStage(this.stageIndex + 1);
    }
  }

  private _setScene(scene: SceneModel): void {
    this.scene = scene;
    this.stageNames = scene.play.map((stage, index) => stage.label || `${(scene?.footer.label || '')}: ${index + 1}`);
    this.setStage(0);
  }

  setStage(stageIndex: number): void {
    this.speechIndex = -1;
    const stage = this.scene?.play[stageIndex];
    if (stage) {
      this.stageIndex = stageIndex;
    } else {
      this.stageIndex = -1;
      this.errorMessage = `Unknown stage index: ${stageIndex}!`;
    }
  }

  private _onLoadError(error: any): void {
    this.errorMessage = 'HTTP load failed!';
    console.error('HTTP load error:', error);
  }
}
