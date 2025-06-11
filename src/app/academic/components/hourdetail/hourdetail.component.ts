import { Component, OnInit } from '@angular/core';
 import { Title } from '@angular/platform-browser';
import { HashTable } from 'angular-hashtable';
import { AcademicYearService } from 'src/app/account/services/academic-year.service';
import { DivisionService } from 'src/app/account/services/division.service';
import { LevelService } from 'src/app/account/services/level.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { AppModule } from 'src/app/app.module';
import { Auth } from 'src/app/shared/auth';
import { Helper } from 'src/app/shared/helper';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';
import { Cache } from 'src/app/shared/cache';
 @Component({
  selector: 'app-hourdetail',
  templateUrl: './hourdetail.component.html',
  styleUrls: ['./hourdetail.component.scss']
})
export class HourdetailComponent implements OnInit {
  public studentSettings = ApplicationSettingService;

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
        // this.titleService.setTitle("HIM"+ " - " + Helper.trans('print result'))
        //     this.applicationSettingService.queueRequests();
        //   var self = this;
        //   Request.fire(false, () => {
        //   });

    }
    isSubmitted=false
    load() {
      this.isSubmitted=true

      this.globalService.loadHtml("affair/report42", this.filter).subscribe((res) => {
        $('#reportContent').html(res);
        this.isSubmitted=false

      }, error => {
        this.isSubmitted=false

      })
    }
   
    printcert(){

    }

      ngOnInit() {
        // this.levels = Cache.get(LevelService.LEVEL_PREFIX);
        // this.divisions = Cache.get(DivisionService.DIVISION_PREFIX);
      //   this.terms = Cache.get(TermService.TERPM_PREFIX);
       this.levels = Cache.get(LevelService.LEVEL_PREFIX);

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

    calculateCount() {
      this.$('#count').text(this.$('#reportContent tbody tr').length);
    }
    onChange(event:any){

  this.case_constraint_id2=event
    }
    case_constraint_id2 = new HashTable();
    government_id = new HashTable();
    onChange2(event:any){
        this.government_id=event
   }
   array:any[]=[];

  AddtoArray(feature:any){
      this.array.push(feature);
  }
   case_constraint_id:any;
   canShowResult = false;
  searchData: any = {};
  response: any = null;
  student: any = {};
  password = null;
  searchCourseKey = null;
  currentPage = 1;

  start_number: any;
  level_id: any;
  
    sendNumber(){
      $('#beforeLoading').hide();
      $('#buttonLoading').show();
      var objectSend = {level_id: this.level_id , start_number: this.start_number};
      console.log(objectSend)
      if(this.level_id == undefined || this.start_number == undefined){
        $('#alertNumber').slideDown(300);
        $('#beforeLoading').show();
      $('#buttonLoading').hide();
        setTimeout(() => {
          $('#alertNumber').slideUp(1000);
        }, 1000);
      } else {
        this.applicationSettingService.makeNumber(objectSend).subscribe((res)=>{
          if(res == 1){
            $('#alertNumberSuccess').slideDown(300);
            $('#beforeLoading').show();
      $('#buttonLoading').hide();
        setTimeout(() => {
          $('#alertNumberSuccess').slideUp(1000);
          $('#closeNumber').trigger('click');
          this.level_id = '';
          this.start_number = '';

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
    print() {
      Helper.print();
    }

    printContent() {
      this.doc.printJs();
    }
    excel() {
      this.doc.exportExcel();
    }
    
  //'الطلبة'
  }