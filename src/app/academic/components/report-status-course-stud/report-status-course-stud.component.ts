import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LevelService } from 'src/app/account/services/level.service';
import { DivisionService } from 'src/app/account/services/division.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { GlobalService } from 'src/app/shared/services/global.service';
import { TermService } from 'src/app/account/services/term.service';
import { AcademicYearService } from 'src/app/account/services/academic-year.service';
@Component({
  selector: 'app-report-status-course-stud',
  templateUrl: './report-status-course-stud.component.html',
  styleUrls: ['./report-status-course-stud.component.scss']
})
export class ReportStatusCourseStudComponent implements OnInit {
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
isSubmitted1=true
load() {
  this.isSubmitted1=false;
  if (!Helper.validator(this.filter, ['level_id' , 'division_id'  ])) {//, 'year_id'
    return Message.error(Helper.trans('please choose all filters'));
  }

  this.globalService.loadHtml("academic/report/students/failed/get", this.filter).subscribe((res) => {
    $('#reportContent').html(res);
    this.isSubmitted1=true;

  });
}
courses:any=[];
filterCourse:any={}
loadCourses() {
  this.filterCourse.term_id=this.filter.term_id
  this.filterCourse.division_id=this.filter.division_id

  this.globalService.get("academic/courses/failed/get", this.filterCourse).subscribe((res) => {
    this.courses=res;

  });
}
onchange(event){
  this.loadCourses()
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
 this. getyaer();
    this.loadCourses();

  }
  yearss:any=[]
  getyaer(){


    this.globalService.get('academic_years').subscribe( (res: any) => {

      this.yearss =res

    });
  }
}
