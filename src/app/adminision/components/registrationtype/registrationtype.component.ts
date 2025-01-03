import { Component, OnInit } from "@angular/core";
import { Cache } from "src/app/shared/cache";
import { Helper } from "src/app/shared/helper";
import { Message } from "src/app/shared/message";
import { Request } from "src/app/shared/request";
import { GlobalService } from "src/app/shared/services/global.service";
import { ApplicationSettingService } from "src/app/adminision/services/application-setting.service";
import { LevelService } from "src/app/account/services/level.service";
import { HashTable } from "angular-hashtable";
import { AcademicSettingService } from "src/app/academic/services/academic-setting.service";
import { CourseService } from "src/app/academic/services/course.service";
import { ReportServiceService } from "src/app/academic/services/report-service.service";
import { StudentAccountService } from "src/app/account/services/student-account.service";
import { TermService } from "src/app/account/services/term.service";
@Component({
  selector: "app-registrationtype",
  templateUrl: "./registrationtype.component.html",
  styleUrls: ["./registrationtype.component.scss"],
})
export class RegistrationtypeComponent implements OnInit {
  illness_reason: any = "";
  acceptance_date:any;
  acceptance_code: any;
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
  loading: boolean = false;
  applicationService: any = ApplicationSettingService;
  public studentSettings = ApplicationSettingService;

  terms: any = [];
  levels: any = [];
  divisions: any = [];
  courses: any = [];
  val: string = "";
  idStudent: any;

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
    this.preSettings();
  }

  ngOnInit() {
    this.terms = Cache.get(TermService.TERPM_PREFIX);
    this.loadSettings();
  }
  filterCourses(term) {
    if (!this.response) return [];
    return this.response.registerCourses.filter((c) => c.term_id == term);
  }

  storeAffair() {
    this.loading = true;
    // validation
    if (!this.student.case_constraint_id) {
      this.loading = false;
      return Message.error("من فضلك قم بادخال جميع الحقول");
    }
    this.globalService
      .store("students/case_constraints/store", {
        student_id: this.student.id,
        case_constraint_id: this.student.case_constraint_id,
        reason: this.illness_reason,
        acceptance_date: this.acceptance_date,
        acceptance_code: this.acceptance_code,
      })
      .subscribe(
        (res) => {
          this.loading = false;
          Message.success("تم الاضافة بنجاح");
        },
        (err) => {
          console.log(err);
          this.loading = false;
          Message.error("حدث خطا ما حاول لاحقا");
        }
      );
  }

  getTermGpa(term) {
    if (!this.response) return 0;
    var gpa = this.response.student_gpa_fasly.filter(
      (g) => g.term_id == term
    )[0].gpa;
    return gpa;
  }

  getStdCode() {
    if (!this.response) return 0;
    var code = this.response.studentInfo[0].code;
    return code;
  }
  preSettings() {
    Request.addToQueue({
      observer: this.courseService.get(),
      action: (res: any) => {
        this.courses = res;
      },
    });
    Request.addToQueue({
      observer: this.applicationSetting.getDivisions(),
      action: (res: any) => {
        this.divisions = res;
      },
    });
    Request.addToQueue({
      observer: this.academicSettingService.get(),
      action: (res: any) => {
        this.academicSetting = new HashTable();
        res.forEach((element) => {
          this.academicSetting.put(element.id, element);
        });
      },
    });
  }
  loadSettings() {
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    Request.fire();
  }
  test($event) {
    console.log($event.target.value);
  }
  loadData() {
    this.searchData.courses = this.selectedCourses.getKeys();
    this.searchData.levels = this.selectedLevels.getKeys();
    this.searchData.divisions = this.selectedDivisions.getKeys();
    this.searchData.page = this.currentPage;
    this.searchData.year_id = this.filter.year_id;
    this.isSubmitted = true;

    // console.log( this.searchData);

    if (this.filter.year_id) {
      this.reportService.getWithStatus(this.searchData).subscribe((res) => {
        this.response = res;
        this.prePagniation();
        this.isSubmitted = false;
      });
    }
  }

  login() {
    let resultPassword: any = this.academicSetting.get(12);
    if (!resultPassword) return;
    if (this.password == resultPassword.value) {
      this.canShowResult = true;
    }
  }
  searchAboutCourse() {
    let self = this;
    if (!this.searchCourseKey) return this.$(".course-item").show();

    this.$(".course-item").hide();
    this.$(".course-item").each((index, element) => {
      if (self.$(element).text().indexOf(self.searchCourseKey) >= 0) {
        self.$(element).show();
      }
    });
  }

  toggle(id, list = new HashTable()) {
    if (list.has(id)) {
      list.remove(id);
    } else {
      list.put(id, id);
    }
  }

  loadPage(page) {
    this.currentPage = page;
    this.loadData();
  }

  prePagniation() {
    if (!this.response.data) return;
    this.response.prev_page = this.response.prev_page_url
      ? this.response.prev_page_url.replace(this.response.path + "?page=", "")
      : null;
    this.response.next_page = this.response.next_page_url
      ? this.response.next_page_url.replace(this.response.path + "?page=", "")
      : null;
    this.response.pages = Math.ceil(
      this.response.total / this.response.per_page
    );
    this.response.pages_arr = [];
    for (let i = 0; i < this.response.pages; i++)
      this.response.pages_arr.push(i + 1);
  }

  print() {
    this.globalService
      .save({ name: this.val, id: this.idStudent })
      .subscribe((res: any) => {});

    var check = 0;
    var array = this.student.payments;
    for (let i = 0; i < array.length; i++) {
      if (array[i].model_object.id == 16) {
        check = 1;
      }
    }
    if (check == 1) {
      Helper.print();
    } else {
      let password = prompt(
        "يجب تسديد مبلغ الخدمة وقيمته 50 للأستثناء ادخل الرقم السري : "
      );
      if (password == "556677") {
        Helper.print();
      } else {
        alert("الرقم السري غير صحيح");
      }
    }
  }
  exportExcel() {
    const filename = "مدفوعات الطلاب-" + new Date().toLocaleTimeString();
    this.doc.exportExcel(filename);
  }

  //***********************************************
  //*** student search methods
  //***********************************************
  //
  searchInputEvent() {
    if (!this.searchKey) return;

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
   display2="none"
   pass2="556677"
   valepa2
   notVailed=false
   increaseTimes(){
    this.notVailed=false

    if(this.pass2==this.valepa2){
      // this.counter=150;

      this.display2 = 'none';
          this.isShow=false

    }else{
      this.notVailed=true
       this.isShow=true

      Message.error(" كلمة السر غير صحيحة ");
      this.valepa2=""
    }
  }
  isShow=true
  loadStudentInfo(id: number) {  // Assuming `id` is of type `number`
    this.isShow=true

    this.academicSettingService.getStudentInfo(id).subscribe((res: any) => {
        this.student = res;
        if (this.student.case_constraint_excuse.length >= 2) { // Ensure `case_constraint_excuse` is safely accessed
            this.valepa2 = "";  // Added space before and after the equals sign for readability
            this.display2 = "block";
            this.isShow=true

        }
        else{
          this.isShow=false

        }
        this.loadData();
    });
}

  oncloseMode(){
    this.display2="none"
  }
}
