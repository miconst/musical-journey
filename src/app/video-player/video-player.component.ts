import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { Autoplay } from '../common/autoplay';

let apiLoaded = false;

@Component({
  selector: 'app-video-player',
  template: `<youtube-player #player [width]="width" [height]="height" [videoId]="videoId" (stateChange)="onPlayerStateChange($event)"></youtube-player>`,
  styles: []
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('player') playerRef?: YouTubePlayer;
  @Input() videoId = '';
  @Input() width?: number;
  @Input() height?: number;
  @Output() currentTimeChange = new EventEmitter<number>();

  playerState: YT.PlayerState = YT.PlayerState.UNSTARTED;

  autoplay = new Autoplay(200);

  constructor() { }

  ngOnInit(): void {
    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.autoplay.stop();
  }

  onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    this.playerState = event.data;

    if (this.playerState === YT.PlayerState.PLAYING) {
      this.watchCurrentTime();
    } else {
      this.autoplay.stop();
    }
  }

  setCurrentTime(value: number): void {
    const player = this.playerRef;
    if (player) {
      player.seekTo(value, true);
      // Restart our watcher
      this.watchCurrentTime();
    }
  }

  getCurrentTime(): number {
    const player = this.playerRef;
    return player ? player.getCurrentTime() : 0;
  }

  watchCurrentTime(): void {
    this.autoplay.stop();

    const player = this.playerRef;
    if (player) {
      this.autoplay.play(() => {
        const time = player.getCurrentTime();
        this.currentTimeChange.emit(time);
        return this.playerState === YT.PlayerState.PLAYING;
      });
    }
  }
}
