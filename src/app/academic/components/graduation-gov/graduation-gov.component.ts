import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AcademicYearService } from 'src/app/account/services/academic-year.service';
import { DivisionService } from 'src/app/account/services/division.service';
import { LevelService } from 'src/app/account/services/level.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Helper } from 'src/app/shared/helper';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Cache } from 'src/app/shared/cache';
  import { Request } from 'src/app/shared/request';
  import { environment } from '../../../../environments/environment';
import { Auth } from 'src/app/shared/auth';
import { AppModule } from 'src/app/app.module';


@Component({
  selector: 'app-graduation-gov',
  templateUrl: './graduation-gov.component.html',
  styleUrls: ['./graduation-gov.component.scss']
})
export class GraduationGovComponent implements OnInit {

  filter: any = {};
    $: any = $;
    applicationService: any = ApplicationSettingService;
    levels: any = [];
    divisions: any = [];
    academicYears: any = [];
    doc: any = document;
    terms: any = [];

    constructor(
      private academicService: AcademicYearService,
      private termService:TermService,
      private titleService: Title,

      private globalService: GlobalService,
      private applicationSettingService: ApplicationSettingService) {
      this.titleService.setTitle("HIM"+ " - " + Helper.trans('print result'))
          this.applicationSettingService.queueRequests();
        var self = this;
        Request.fire(false, () => {
        });

  }

  load() {
    if (!Helper.validator(this.filter, ['level_id' , 'division_id'  ])) {//, 'year_id'
      // return Message.error(Helper.trans('please choose all filters'));
    }

    this.globalService.loadHtml("affair/reportgrad_gov", this.filter).subscribe((res) => {
      $('#reportContent').html(res);
    });
  }
  printcert(){

  }
  excel() {
    this.doc.exportExcel();
  }

  printContent() {
    this.doc.printJs();
  }
    ngOnInit() {
      this.levels = Cache.get(LevelService.LEVEL_PREFIX);
      this.divisions = Cache.get(DivisionService.DIVISION_PREFIX);
      this.terms = Cache.get(TermService.TERPM_PREFIX);
    }

    printcertif(){
      const formdate={
        "division_id":this.filter.division_id,
        "level_id":this.filter.level_id,
        "term_id":this.filter.term_id,

        api_token: Auth.getApiToken()
      }
      const options = "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=200,width=905,height=484";

       const url = environment.apiUrl + "/academic/graduation/certificates/get?" + AppModule.doc.jquery.param(formdate);
       window.open(url, "_blank", options);
    }
  printcertifnotSig(){
      const formdate={
        "division_id":this.filter.division_id,
        "level_id":this.filter.level_id,
        "term_id":this.filter.term_id,

        api_token: Auth.getApiToken()
      }
      const options = "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=200,width=905,height=484";

       const url = environment.apiUrl + "/academic/graduation/certificates/get/not_depend?" + AppModule.doc.jquery.param(formdate);
       window.open(url, "_blank", options);
    }
}
