import { Component, OnInit, ViewChild } from '@angular/core';
import { HashTable } from 'angular-hashtable';
import { LevelService } from 'src/app/account/services/level.service';
import { StudentAccountService } from 'src/app/account/services/student-account.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
 import { stringify } from '@angular/compiler/src/util';
import { GlobalService } from 'src/app/shared/services/global.service';
import { DivisionService } from '../account/services/division.service';
import { Auth } from '../shared/auth';
import { environment } from 'src/environments/environment';
import { AppModule } from '../app.module';
import { formatDate } from '@angular/common';
import { SystemSettingService } from '../core/services/system-setting.service';
@Component({
  selector: 'app-bookservice',
  templateUrl: './bookservice.component.html',
  styleUrls: ['./bookservice.component.scss']
})
export class BookserviceComponent implements OnInit  {

  filter: any = {};
  formatDate22: any = {};

    $: any = $;
    applicationService: any = ApplicationSettingService;
    levels: any = [];
    divisions: any = [];
    academicYears: any = [];
    doc: any = document;
    terms: any = [];
currentPage=1;
    constructor(
       private termService:TermService,

      private globalService: GlobalService,private systemSettingService: SystemSettingService,
      private applicationSettingService: ApplicationSettingService,private studentAcountService: StudentAccountService,) {
      // this.titleService.setTitle("HIM"+ " - " + Helper.trans('print result'))
      //     this.applicationSettingService.queueRequests();
      //   var self = this;
      //   Request.fire(false, () => {
      //   });

  }

  bookData:any=[];
  isSubmitted1=true
  isSubmitted2=true
  getData(page=1){
       this.bookData=[]
        this.isSubmitted1=false;
      this.filter.page=page
      this.globalService.get('account/book_payments',this.filter).subscribe( (res: any) => {

      this.bookData =res
      this.prePagniation();

      this.isSubmitted1=true;

    });
  }
  prePagniation() {
    if (!this.bookData.data)
      return;
    this.bookData.prev_page = this.bookData.prev_page_url? this.bookData.prev_page_url.replace(this.bookData.path+'?page=', '') : null;
    this.bookData.next_page = this.bookData.next_page_url? this.bookData.next_page_url.replace(this.bookData.path+'?page=', '') : null;
    this.bookData.pages = Math.ceil(this.bookData.total / this.bookData.per_page);
    this.bookData.pages_arr = [];
    for(let i = 0; i < this.bookData.pages; i ++)
      this.bookData.pages_arr.push(i+1);
  }

  loadSettings() {
    this.systemSettingService.getSystemSetting().subscribe((res: any)=>{
      debugger
      this.filter.academic_year_id = res["current_academic_year"].id;
      this.filter.term_id = res["current_term"].id;

     });
  }
  notes
  yearss=[]
  getyaer(){


    this.globalService.get('academic_years').subscribe( (res: any) => {

      this.yearss =res

    });
  }
  printt:any
  update(bookData){
     debugger
        this.isSubmitted2=false;
       this.formatDate22.division_id=this.filter.division_id;
      this.formatDate22.level_id=this.filter.level_id;
      this.formatDate22.term_id=this.filter.term_id;
      // this.formatDate22.additional_book=this.additional_books;
      // this.formatDate22.receive_id=this.receive;
      this.formatDate22.id= bookData.id;
      this.formatDate22.note= bookData.note;


    this.globalService.store('account/update_book_payments',this.formatDate22).subscribe( (res: any) => {


      this.isSubmitted2=true;
      this.getData();

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
      this.getyaer()
      this.loadSettings()
      // this.filter.term_id=1;
      this.filter.level_id="";
      this.filter.division_id="";
      this.filter.receive_id="";


      this.getData()
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
    @ViewChild('myCheckbox') myCheckbox;
    @ViewChild('myCheckbox2') myCheckbox2;

    receive=0
    additional_books=0;
    print() {
      Helper.print();
    }

    exportExcel() {
      const filename = "   الكتب-"+new Date().toLocaleTimeString();
      this.doc.exportExcel(filename);
    }
    checkValue(event: any,item){
       debugger

         if(event.target.checked==true){
          this.formatDate22.receive_id=1;

        }else{

          this.formatDate22.receive_id=0;

        }

        }
       checkValue2(event: any,item){

          if(event.target.checked==true){
            this.formatDate22.additional_book=1;
        }else{

          this.formatDate22.additional_book=0;

        }


       }
        paymony=0;
         public safeObject: any = {};
          public searchKey: string;
         totalPayments : number = 0;
         public studentSearchId;
         public availableServices: any;

         public studentSearchDialogShow = false;
         public studentSearchDialogLoader = false;
         public showStudentInstallment = false;
         public isWait = false;
         public timeoutId;
         public students: any = [];
         public isStudentSayed = false;
         public updateStudent: any;

         public selectedServices = new HashTable<any, any>();
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
      StudIDD
  selectStudent(student) {
    this.studentSearchDialogShow = false;
    this.searchKey = student.name;
    this.studentSearchId = student.id;
    this.StudIDD=student.id;
    //
    this.loadStudentAccountInfo(student.id);
    // this.ShowStudentrecords(student.id);
      // this.showPaied()

  }

  loadStudentAccountInfo(id) {
    if (!id)
      return Message.error('search about student first');
    this.studentAcountService.getStudentAccount(id).subscribe((r: any) => {

    this.filter.student_name=r.name;




      if (this.safeObject.id != r.id)
        this.isStudentSayed = false;

      this.safeObject = r;
      // this.buildSafeMsg();
      this.studentSearchId = this.safeObject.id;

      if (!this.safeObject.old_balance)
        this.safeObject.old_balance = 0;

      if (!this.safeObject.current_balance)
        this.safeObject.current_balance = 0;

      if (!this.safeObject.paid_value)
        this.safeObject.paid_value = 0;

      if (!this.safeObject.image)
        this.safeObject.image = '/assets/img/avatar.png';
      // this.loadAvailableServices();

      // this.alertForOldBalance();
      // this.safeAlerter = new SafeAlerter(this.safeObject);
      // this.safeAlerter.notify();
    });
  }

  u
}
