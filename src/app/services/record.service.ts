import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Observable } from 'rxjs';
interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private stream;
  private recorder;
  private interval;
  private startTime;
  private _recorded = new Subject<any>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();
  private _fileRecorded: File;
  constructor() { }



  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }
  startRecording(isAudio: Boolean) {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this._recordingTime.next('00:00');
    if (isAudio) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
        this.stream = s;
        this.record(isAudio);
      }).catch(error => {
        this._recordingFailed.next();
      });
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(s => {
        this.stream = s;
        this.record(isAudio);
      }).catch(error => {
        this._recordingFailed.next();
      });
    }


  }
  private record(isAudio: Boolean) {

    if (isAudio) {
      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: 'audio/wav'
      });
    } else {
      this.recorder = new RecordRTC.MediaStreamRecorder(this.stream, {
        type: 'video',
        mimeType: 'video/mp4'
      });
    }

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this._recordingTime.next(time);
      },
      1000
    );
  }
  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }
  stopRecording(isAudio: Boolean) {
    let fileMpeg = null;
    const uniqSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    if (this.recorder) {
      this.recorder.stop(async (blob) => {
        if (this.startTime) {
          if (isAudio) {
            fileMpeg = encodeURIComponent(uniqSuffix + 'audio_' + new Date().getTime() + '.mp3');
          } else {
            fileMpeg = encodeURIComponent(uniqSuffix + 'video_' + new Date().getTime() + '.mp4');
          }
          this.stopMedia(isAudio);
          this._recorded.next({ blob, title: fileMpeg });
        }
      }, () => {
        this.stopMedia(isAudio);
        this._recordingFailed.next();
      });
    }

  }
  private stopMedia(isAudio: Boolean) {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        if (isAudio) {
          this.stream.getAudioTracks().forEach(track => track.stop());
        } else {
          this.stream.getVideoTracks().forEach(track => track.stop());
        }
        this.stream = null;
      }
    }
  }
  abortRecording(isAudio: Boolean) {
    this.stopMedia(isAudio);
  }
  clearRecorded() {
    this._recorded = null;
  }
  public getFile() {
    // console.log(this._fileRecorded);
    return this._fileRecorded;
  }
}
