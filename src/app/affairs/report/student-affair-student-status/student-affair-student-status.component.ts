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
@Component({
  selector: 'app-student-affair-student-status',
  templateUrl: './student-affair-student-status.component.html',
  styleUrls: ['./student-affair-student-status.component.scss']
})

export class StudentAffairStudentStatusComponent implements OnInit {
  $: any = $;
  doc: any = document;
  isSubmitted = false;
  searchData: any = {};
  response: any = null;
  student: any = {};
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
  selectedCourses = new HashTable();

  // حالات القيد التي لا تُطبع لها نتيجة (منسحب لاسباب / وفاة / ايقاف قيد)
  HIDDEN_CASE_IDS: any = [6, 7, 8];
  // منسحب لاسباب / سحب ملف (متوفي) / سحب ملف
  WITHDRAWN_IDS: any = [6, 9, 10];
  // عذر بموافقة الوزارة عن العام الدراسي كله
  YEAR_EXCUSE_IDS: any = [11, 14];
  // عذر بموافقة الوزارة عن ترم بعينه
  TERM_EXCUSE_IDS: any = { 1: 15, 2: 16 };

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
      this.preSettings();
     
    }

  ngOnInit() {
    this.terms = Cache.get(TermService.TERPM_PREFIX);
    this.loadSettings();
  }

  filterCourses(term){
    if(! this.response) return []
    return this.response.registerCourses.filter(c => c.term_id == term)
  }

  // بيانات الطالب الاساسية
  get info() {
    if (! this.response || ! this.response.studentInfo || ! this.response.studentInfo.length) return {}
    return this.response.studentInfo[0]
  }

  // اعدادات المعهد (الاسم / العميد / اسماء الموقعين) القادمة من globale_settings
  get settings() {
    return (this.response && this.response.settings) ? this.response.settings : {}
  }

  // اعضاء لجنة الكنترول لمستوى الطالب - مخزنين كنص مفصول بفاصلة
  get controlMembers() {
    if (! this.settings.control_members) return []
    return this.settings.control_members.split(/[،,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0)
  }

  // الاعذار المعتمدة للطالب في العام المختار و التي تلغي نتيجة ترم معين
  termExcuses(term) {
    if (! this.response || ! this.response.caseConstraints) return []
    return this.response.caseConstraints.filter(c =>
      this.YEAR_EXCUSE_IDS.indexOf(+c.case_constraint_id) >= 0
      || +c.case_constraint_id == this.TERM_EXCUSE_IDS[term]
    )
  }

  isTermExcused(term) {
    return this.termExcuses(term).length > 0
  }

  // حالات قيد لا تُطبع لها نتيجة اصلا
  get isResultHidden() {
    return this.HIDDEN_CASE_IDS.indexOf(+this.info.case_constraint_id) >= 0
  }

  get isWithdrawn() {
    return this.WITHDRAWN_IDS.indexOf(+this.info.case_constraint_id) >= 0
  }

  canShowTerm(term) {
    return ! this.isResultHidden && ! this.isTermExcused(term)
  }
  getTermGpa(term){
    if(! this.response || ! this.response.student_gpa_fasly) return '0.00'
    var row = this.response.student_gpa_fasly.filter(g => g.term_id == term)[0]
    if (! row) return '0.00'
    var gpa = parseFloat(row.gpa)
    // القيمة قد تعود من قاعدة البيانات باعداد عشرية طويلة (2.0999999999999998)
    return isNaN(gpa) ? '0.00' : gpa.toFixed(2)
  }
  getStdCode(){
    if(! this.response) return 0
    var code  = this.response.studentInfo[0].code
    return code

  }
  preSettings() {
    Request.addToQueue({observer: this.courseService.get(), action: (res: any)=>{
      this.courses = res;
    }});
    Request.addToQueue({observer: this.applicationSetting.getDivisions(), action: (res: any)=>{
      this.divisions = res;
    }});
  }
  loadSettings() {
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    Request.fire();
  }
  test($event)
  {
    console.log($event.target.value)
  }
  loadData() {
    this.searchData.courses = this.selectedCourses.getKeys();
    this.searchData.levels = this.selectedLevels.getKeys();
    this.searchData.divisions = this.selectedDivisions.getKeys();
    this.searchData.page = this.currentPage;
    this.searchData.year_id = this.filter.year_id;
    this.isSubmitted = true;


    // console.log( this.searchData);

    if(this.filter.year_id){
      
      this.reportService.getWithStatus(this.searchData).subscribe((res) => {
        // this.birthdaytime = this.birthdaytime;
        this.response = res;
        this.prePagniation();
        this.isSubmitted = false;
      });
    }

  }

 

  searchAboutCourse() {
    let self = this;
    if (!this.searchCourseKey)
      return this.$('.course-item').show();

    this.$('.course-item').hide();
    this.$('.course-item').each(( index, element ) => {
      if (self.$(element).text().indexOf(self.searchCourseKey) >= 0) {
        self.$(element).show();
      }
    });
  }

  toggle(id, list = new HashTable()) {
    if (list.has(id))  {
      list.remove(id);
    }
    else {
      list.put(id, id);
    }
  }

  loadPage(page) {
    this.currentPage = page;
    this.loadData();
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
  print() {
    Helper.print();
  }


  exportExcel()
  {
    const filename = "مدفوعات الطلاب-"+new Date().toLocaleTimeString();
    this.doc.exportExcel(filename);
  }



  //***********************************************
  //*** student search methods
  //***********************************************
  //
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
      this.searchKey = student.name;
      this.loadStudentInfo(student.id);
    }
    this.studentSearchDialogShow = false;
  }

  loadStudentInfo(id) {
    this.academicSettingService.getStudentInfo(id).subscribe((res: any) => {
      this.student = res;
      this.loadData();
    });
  }
}
