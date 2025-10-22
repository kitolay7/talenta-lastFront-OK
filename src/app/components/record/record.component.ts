import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RecordService } from 'src/app/services/record.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  @Input() isAudio: Boolean;
  isRecording = false;
  recordedTime;
  blobUrl: SafeUrl;
  blobUrlString: string;
  @Output() blobEvent = new EventEmitter<any>();

  constructor(private sanitizer: DomSanitizer,
    private recordS: RecordService) {
    this.recordS.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.recordS.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.recordS.getRecordedBlob().subscribe((data) => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }

  ngOnInit(): void {
  }
  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.recordS.startRecording(this.isAudio);
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.recordS.abortRecording(this.isAudio);
    }
  }

  async stopRecording() {
    if (this.isRecording) {
      await this.recordS.stopRecording(this.isAudio);
      this.isRecording = false;
      // console.log(this.recordS.getFile());
      this.recordS.getRecordedBlob().subscribe((data) => {
        // this.blobUrlString = URL.createObjectURL(data.blob);
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
        // this.getBlobUrl(URL.createObjectURL(data.blob));
        this.getBlobUrl(data);
      });
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  async getBlobUrl(data: any) {
    this.blobEvent.emit(data);
  }
}
