import { Component, OnInit } from '@angular/core';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { LevelService } from 'src/app/account/services/level.service';
import { HashTable } from 'angular-hashtable';
import { AcademicSettingService } from 'src/app/academic/services/academic-setting.service';
import { CourseService } from 'src/app/academic/services/course.service';
import { ReportServiceService } from 'src/app/academic/services/report-service.service';
import { StudentAccountService } from 'src/app/account/services/student-account.service';
import { TermService } from 'src/app/account/services/term.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Auth } from 'src/app/shared/auth';
@Component({
  selector: 'app-removestd',
  templateUrl: './removestd.component.html',
  styleUrls: ['./removestd.component.scss']
})
export class RemovestdComponent implements OnInit {
  $: any = $;
  doc: any = document;
  isSubmitted = false;
  canShowResult = false;
  searchData: any = {};
  response: any = null;
  student: any = {};
  password = null;
  searchCourseKey = null;
  currentPage = 1;
  filter: any = {};
  applicationService: any = ApplicationSettingService;
  terms: any = [];
  levels: any = [];
  divisions: any = [];
  courses: any = [];
  val:string ="";
  val2:string ="";
  idStudent: any;
  today = new Date();
  changedDate = '';
  birthdaytime:any;

  selectedDivisions = new HashTable();
  selectedLevels = new HashTable();
  academicSetting = new HashTable();
  selectedCourses = new HashTable();

  //
  public searchKey: string;
  public studentSearchDialogShow = false;
  public studentSearchDialogLoader = false;
  public isWait = false;
  public timeoutId;
  public students: any = [];
  SettingService: any;


  constructor(
    private courseService: CourseService,
    private studentAcountService: StudentAccountService,
    private academicSettingService: AcademicSettingService,
    private reportService: ReportServiceService,
    private applicationSetting: ApplicationSettingService,
    private globalService: GlobalService
    ) {
      
    }

  ngOnInit() {
 
  }

 
 

  toggle(id, list = new HashTable()) {
    if (list.has(id))  {
      list.remove(id);
    }
    else {
      list.put(id, id);
    }
  }

   

  prePagniation() {
    if (!this.response.data)
      return;
    this.response.prev_page = this.response.prev_page_url? this.response.prev_page_url.replace(this.response.path+'?page=', '') : null;
    this.response.next_page = this.response.next_page_url? this.response.next_page_url.replace(this.response.path+'?page=', '') : null;
    this.response.pages = Math.ceil(this.response.total / this.response.per_page);
    this.response.pages_arr = [];
    for(let i = 0; i < this.response.pages; i ++)
      this.response.pages_arr.push(i+1);
  }
  
 
   excel() {
    this.doc.exportExcel();
  }

     load() {
      if (!this.filter.type  || ! this.filter.student_id) {
      return Message.error(Helper.trans('please choose all filters'));
    }
       let url1 = environment.publicUrl + "/api/affair/report48"  + "?api_token=" + Auth.getApiToken()+ "&type=" + this.filter.type
       + "&student_id=" + this.filter.student_id;
        Helper.openWindow(url1);
     }
      followload() {
      
       let url1 = environment.publicUrl + "/api/affair/report49"  + "?api_token=" + Auth.getApiToken()+ "&type=" + this.filter.type
       
        Helper.openWindow(url1);
     }
loadold() {
    if (!this.filter.type || ! this.filter.student_id) {
      return Message.error(Helper.trans('please choose all filters'));
    }

    this.globalService.loadHtml("affair/report48", this.filter).subscribe((res) => {
      $('#reportContent').html(res);
    });
  }
  printContent() {
    this.doc.printJs();
  }
 
  searchInputEvent() {
    if (!this.searchKey)
      return;

    this.students = [];
    this.studentSearchDialogLoader = true;
    this.isWait = true;
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
       this.searchAboutStudent();
    }, 500);
  }

  searchAboutStudent() {
    this.studentAcountService.search(this.searchKey).subscribe((r) => {
        this.studentSearchDialogLoader = false;
        this.students = r;
        if (this.students.length > 0) {
          this.studentSearchDialogShow = true;
        }
    });
  }

  selectStudent(student) {
    if (student) {
      this.searchData.student_id = student.id;
      this.filter.student_id = student.id;
      this.searchKey = student.name;
      // this.loadStudentInfo(student.id);
    }
    this.studentSearchDialogShow = false;
  }

  // loadStudentInfo(id) {
  //   this.academicSettingService.getStudentInfo(id).subscribe((res: any) => {
  //     this.student = res;
  //     this.loadData();
  //   });
  // }
}

