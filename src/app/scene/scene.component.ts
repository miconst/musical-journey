// tslint:disable: variable-name
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SceneModel } from '../scene-model';
import { VideoPlayerComponent } from '../video-player/video-player.component';

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

  @ViewChild('player') playerRef?: VideoPlayerComponent;

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    this._http
      .get<SceneModel>(ASSETS_URL + 'toy.json')
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
        if (line.start <= currentTime && currentTime < line.end) {
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
        const time = line.start;
        if (Math.abs(time - player.getCurrentTime()) > 0.05) {
          player.setCurrentTime(time);
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
      this._setStage(this.stageIndex - 1);
    }
  }

  hasNextStage(): boolean {
    const stage = this.scene?.play[this.stageIndex + 1];
    return !!stage;
  }

  onNextStage(): void {
    if (this.hasNextStage()) {
      this._setStage(this.stageIndex + 1);
    }
  }

  private _setScene(scene: SceneModel): void {
    this.scene = scene;
    this._setStage(0);
  }

  private _setStage(stageIndex: number): void {
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
