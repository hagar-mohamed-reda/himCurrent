 import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AcademicYearService } from 'src/app/account/services/academic-year.service';
import { DivisionService } from 'src/app/account/services/division.service';
import { LevelService } from 'src/app/account/services/level.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { GlobalService } from 'src/app/shared/services/global.service';
import { CourseService } from '../../services/course.service';
@Component({
  selector: 'app-academic-note',
  templateUrl: './academic-note.component.html',
  styleUrls: ['./academic-note.component.scss']
})
export class AcademicNoteComponent implements OnInit {
displaylic="none"
  filter: any = {};
  $: any = $;
  applicationService: any = ApplicationSettingService;
  levels: any = [];
  level_id:any;

  divisions: any = [];
  courses: any = [];
  groups: any = [];
  sections: any = [];
  academicYears: any = [];
  filter_search:any = {};
  doc: any = document;
  terms: any = [];
  data:any = [];
  division_id:any;
  term_id:any;
 page= 1  
  constructor(
    private courseService: CourseService,
    private academicService: AcademicYearService,
    private termService:TermService,
    private titleService: Title,
    private globalService: GlobalService,
    private applicationSettingService: ApplicationSettingService)
     {
      this.groups = this.applicationSettingService.groups().subscribe((res: any) => {
        this.groups = res;
      })

      this.courses = this.courseService.getopenCourses().subscribe((res: any) => {
        this.courses = res;
      })
    this.titleService.setTitle("HIM"+ " - " + Helper.trans('print result'))
        this.applicationSettingService.queueRequests();
      var self = this;
      Request.fire(false, () => {
      });

}
ishidden=false
dataFromApi:any
pagination:any
arrofStudent:any=[]
load(page: number = 1) {
  this.ishidden=true
  console.log(this.filter);

  if (!Helper.validator(this.filter, ['year_id'])) {
    return Message.error(Helper.trans('please choose all filters'));
  }else{
  //  this.page=page;
  //  this.filter.current_page=this.page,
  //  this.filter.page=this.page,
    this.globalService.get("student_notes/report", this.filter).subscribe((res) => {
      
      this.dataFromApi=res
      this.arrofStudent=this.dataFromApi.data
          // this.pagination = this.dataFromApi.pagination || this.pagination;

    });
  }


}
changePage(page: number) {
  if (page < 1 || page > this.pagination.last_page || page === this.pagination.current_page) {
    return;
  }
  this.load(page);
}
get pages(): number[] {
  const pages: number[] = [];
  const last = this.pagination.last_page || 1;

   const start = Math.max(1, this.pagination.current_page - 2);
  const end = Math.min(last, this.pagination.current_page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
 
getSections(){
  this.sections = this.applicationSettingService.sections(this.filter).subscribe((res: any) => {
    this.sections = res;
  })
}
excel() {
  this.doc.exportExcel();
}

printContent() {
  this.doc.printJs();
}
  ngOnInit() {
    $('#division_id').on('change' , ()=>{
      this.division_id = $('#division_id').val();
    })
    $('#term_id').on('change' , ()=>{
      this.term_id = $('#term_id').val();
    })
    $('#level_id').on('change' , ()=>{
      this.level_id = $('#level_id').val();
    })
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    this.divisions = Cache.get(DivisionService.DIVISION_PREFIX);
    this.terms = Cache.get(TermService.TERPM_PREFIX);
  }

}
