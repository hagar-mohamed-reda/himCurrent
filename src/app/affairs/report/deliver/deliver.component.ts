import { Component, OnInit } from '@angular/core';
 import { LevelService } from 'src/app/account/services/level.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { GlobalService } from 'src/app/shared/services/global.service';
@Component({
  selector: 'app-deliver',
  templateUrl: './deliver.component.html',
  styleUrls: ['./deliver.component.scss']
})
export class DeliverComponent implements OnInit {


 
    filter: any = {};
    $: any = $;
    applicationService: any = ApplicationSettingService;
    levels: any = [];
    divisions: any = [];
    academicYears: any = [];
    doc: any = document;
    commissions: any;
  
    constructor(
      private globalService: GlobalService,
      private applicationSettingService: ApplicationSettingService) {
        this.applicationSettingService.queueRequests();
        var self = this;
        Request.fire(false, () => {
        });
  
  
      }
  
    load() {
      if (!Helper.validator(this.filter, ['state'])) {
        return Message.error(Helper.trans('اختر الحاله'));
      }
  
      this.globalService.loadHtml("affair/report41", this.filter).subscribe((res) => {
        $('#reportContent').html(res);
      });
    }
 
  
    printContent() {
      this.doc.printJs();
    }
  
    ngOnInit() {
      this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    }
  }
  