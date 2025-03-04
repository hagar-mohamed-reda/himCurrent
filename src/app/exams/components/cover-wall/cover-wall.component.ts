import { Component, OnInit } from '@angular/core';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ApplicationSettingService } from '../../../adminision/services/application-setting.service';
import { LevelService } from '../../../account/services/level.service';
import { DivisionService } from 'src/app/account/services/division.service';
@Component({
  selector: 'app-cover-wall',
  templateUrl: './cover-wall.component.html',
  styleUrls: ['./cover-wall.component.scss']
})
export class CoverWallComponent implements OnInit{
  filter: any = {};
  $: any = $;
  applicationService: any = ApplicationSettingService;
  levels: any = [];
  divisions: any = [];
  academicYears: any = [];
  doc: any = document;
  commissionsGet: any;
  division_id: any;
  level_id: any;

  constructor(
    private globalService: GlobalService,
    private applicationSettingService: ApplicationSettingService) {
      this.applicationSettingService.queueRequests();
      var self = this;
      Request.fire(false, () => {
      });


    }

  load() {
    if (!Helper.validator(this.filter, [ 'level_id' , 'division_id'])) {
      return Message.error(Helper.trans('please choose all filters'));
    }

    this.globalService.loadHtml("affair/cover1", this.filter).subscribe((res) => {
      $('#reportContent').html(res);
    });
  }

  printContent() {
    this.doc.printJs();
  }
  excel() {
    this.doc.exportExcel();
  }
  prevTheaters=[]
  ngOnInit() {
      this.levels = Cache.get(LevelService.LEVEL_PREFIX);
      this.divisions = Cache.get(DivisionService.DIVISION_PREFIX);
      this.applicationSettingService.commissions().subscribe((res)=>{
      this.commissionsGet = res;
    })
    // this.applicationSettingService.theaters().subscribe((res: any) => {
    //   this.prevTheaters = res;
    // })
  }

}
