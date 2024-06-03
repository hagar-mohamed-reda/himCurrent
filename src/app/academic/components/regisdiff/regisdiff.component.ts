 import { Component, OnInit } from '@angular/core';
 import { LevelService } from 'src/app/account/services/level.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { GlobalService } from 'src/app/shared/services/global.service';
@Component({
  selector: 'app-regisdiff',
  templateUrl: './regisdiff.component.html',
  styleUrls: ['./regisdiff.component.scss']
})
export class RegisdiffComponent implements OnInit {

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
    isSubmitted = false;

  load() {
    
    this.isSubmitted = true;

    this.globalService.loadHtml("affair/report37", this.filter).subscribe((res) => {
      $('#reportContent').html(res);
      this.isSubmitted = false;

    });
  }

  createCommissions(){
    $('#beforeLoading').hide();
    $('#buttonLoading').show();
    var objectSend = {name: this.commissions};
    console.log(objectSend)
    if(this.commissions == undefined || this.commissions == '' || this.commissions == null){
      $('#alertNumber').slideDown(300);
      $('#beforeLoading').show();
    $('#buttonLoading').hide();
      setTimeout(() => {
        $('#alertNumber').slideUp(1000);
      }, 1000);
    } else {
      this.applicationSettingService.commissionsStore(objectSend).subscribe((res)=>{
        if(res == 1){
          $('#alertNumberSuccess').slideDown(300);
          $('#beforeLoading').show();
    $('#buttonLoading').hide();
      setTimeout(() => {
        $('#alertNumberSuccess').slideUp(1000);
        $('#closeNumber').trigger('click');
        this.commissions = '';

      }, 1000);
        } else {
          $('#alertNumber').slideDown(300);
          $('#beforeLoading').show();
    $('#buttonLoading').hide();
      setTimeout(() => {
        $('#alertNumber').slideUp(1000);
      }, 1000);
        }
      })
    }
  }

  printContent() {
    this.doc.printJs();
  }
  terms:any=[]
  ngOnInit() {
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    this.terms = Cache.get(TermService.TERPM_PREFIX);

  }
}