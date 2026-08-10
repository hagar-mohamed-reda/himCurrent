import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LevelService } from 'src/app/account/services/level.service';
import { DivisionService } from 'src/app/account/services/division.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { CourseService } from '../../services/course.service';
import { StudentResultService } from '../../services/student-result.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';




@Component({
  selector: 'app-student-cert-may-jan',
  templateUrl: './student-cert-may-jan.component.html',
  styleUrls: ['./student-cert-may-jan.component.scss']
})
export class StudentCertMayJanComponent implements OnInit  {

  $: any = $;
  doc: any = document;
  division_id: any = null;
  result: any = [];
  levels: any = [];
  divisions: any = [];
  courses: any = [];
  response: any = {};
  course_id: any = null;
  level_id: any = null;
  currentPage = 1;
  isLoading = false;
  isSubmitted = false;
  import_result: any;
  term_id: any;
  year_id: any;
  excelClick: any = true;
  excelClick2: any = false;
  applicationService: any = ApplicationSettingService;
  printCourse: any;
  
  constructor(
    private titleService: Title,
    private studentResultService: StudentResultService, private courseService: CourseService) {
    this.titleService.setTitle("HIM"+ " - " + Helper.trans('control'))
     }


     exportExcel() {
      this.excelClick = false;
      this.excelClick2 = true;
      setTimeout(() => {
        const filename = " نتايح الطلبة-"+new Date().toLocaleTimeString();
      this.doc.exportExcel(filename);
      setTimeout(() => {
        this.excelClick = true;
      this.excelClick2 = false;
      }, 2000);
      }, 1000);


    }

  ngOnInit() {
    var self = this;
    // set select2
    setTimeout(() => {
      this.$('.select2').select2();
    }, 500);
    this.loadLevels();
    // this.loadCourses();
    this.loadDivision();
    // this.loadResult();
    // this.loadResult();
    
    $('#level_id').on('select2:select', function (e: any) {
      self.level_id = $('#level_id').val();
    });
   
     
    $('#division_id').on('select2:select', function (e: any) {
      self.division_id = $('#division_id').val();
    });
    

  }
  excel(){
    Message.error('من فضلك أختر المادة');
  }

  loadLevels() {
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
  }
  loadDivision() {
    this.divisions = Cache.get(DivisionService.DIVISION_PREFIX);
  }

  loadCourses() {
    this.courseService.getopenCourses().subscribe((res) => {
      this.courses = res;
      console.log(res);
      
    });
  }

  loadResult() {
 

      let data = {
        level_id: this.$('.level_id').val(),
        division_id: this.$('.division_id').val(),
        page: this.currentPage
      };
      this.isLoading = true;
      this.studentResultService.graduationGet(data).subscribe((res)=>{
        this.response = res;
        this.result = this.response.data;
        this.prePagniation();
        this.isLoading = false;
      });
     

  }


  toApiDate(value: any) {
    if (!value) return value;
    let parts = ('' + value).split('-');
    // input[type=date] gives yyyy-mm-dd; convert to dd-mm-yyyy
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return value;
  }

  updateResult() {

    let data = {
      students: this.result.map((item: any) => ({
        ...item,
        grad_depend_date: this.toApiDate(item.grad_depend_date),
        grad2_depend_date: this.toApiDate(item.grad2_depend_date),
      })),

     };
    this.isSubmitted = true;
    this.studentResultService.graduationStore(data).subscribe((res: any)=>{
      if (res.status == 1){
        this.loadResult();
        setTimeout(() => {
            Message.success(res.message);
          }, 5000);
    }
      else
      setTimeout(() => {
        Message.error(res.message);
      }, 5000);

      this.isSubmitted = false;
    });




  }

  loadPage(page) {
    this.currentPage = page;
    this.loadResult();
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
  calculate(id: any){
    debugger
    if($(`#final_tahrery_degree${id}`).val() == -1) {
      $(`#final_degree${id}`).html('غياب');
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 1000);
    } else if($(`#final_tahrery_degree${id}`).val() == -2){
      $(`#final_degree${id}`).html('شغب');
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 1000);
    } else if($(`#final_tahrery_degree${id}`).val() == -3){
      $(`#final_degree${id}`).html('غش');
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 1000);
    } else if($(`#final_tahrery_degree${id}`).val() == -4){
      $(`#final_degree${id}`).html('انسحاب');
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 1000);
    } 
    else if($(`#final_tahrery_degree${id}`).val() == -5){
      $(`#final_degree${id}`).html('راسب تحريرى');
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 1000);
    }
    else if($(`#final_tahrery_degree${id}`).val() == -6){
      $(`#final_degree${id}`).html('حرمان');
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 1000);
    } else {
      var x: any = 0;
      $(`#final_degree${id}`).html('');
      console.log($(`#mid_degree${id}`).val());
      var a: any = ($(`#mid_degree${id}`).val() == null || $(`#mid_degree${id}`).val() == undefined || $(`#mid_degree${id}`).val() == '' ) ? 0 : $(`#mid_degree${id}`).val();
      var b: any = ($(`#work_year_degree${id}`).val() == null || $(`#work_year_degree${id}`).val() == undefined || $(`#work_year_degree${id}`).val() == '' ) ? 0 : $(`#work_year_degree${id}`).val();
      var c: any = ($(`#final_tahrery_degree${id}`).val() == null || $(`#final_tahrery_degree${id}`).val() == undefined || $(`#final_tahrery_degree${id}`).val() == '' ) ? 0 : $(`#final_tahrery_degree${id}`).val();
      var d: any = ($(`#amly_degree${id}`).val() == null || $(`#amly_degree${id}`).val() == undefined || $(`#amly_degree${id}`).val() == '' ) ? 0 : $(`#amly_degree${id}`).val();
      x = parseFloat(a) + parseFloat(b) + parseFloat(c) + parseFloat(d) ;
      $(`#final_degree${id}`).html(x);
      // this.updateResult();
      // $('#cal').trigger('click');
      // setTimeout(() => {
      //   $('#getResult').trigger('click');
      // }, 2000);
    }
  }
  print() {
    this.excelClick = false;
    this.excelClick2 = true;
    $(".title").css("width","100%");
    $(".title").css("text-align","center");
    $(".title").css("display","flex");
    $(".title").css("align-items","center");
    $(".text,.image").css("width","50%");
    $("th").attr('style', 'padding: 1px!important;text-align: center !important;vertical-align: middle !important;border: 1px solid black !important;font-weight: bolder !important;font-size:12.5px !important;background-color: #d4d4d4 !important;')
    $("td").attr('style', 'padding: 1px!important;text-align: center !important;vertical-align: middle !important;border: 1px solid black !important;font-weight: bolder !important;font-size:12.5px !important;')
    $('h6').attr('style', 'font-weight: bolder !important;font-size: 12.5px !important;');
    $('h6').attr('style', 'font-weight: bolder !important;font-size: 12.5px !important;');
    $('img').attr('width', '100px');
    $('img').attr('style', 'margin: auto;');

    setTimeout(() => {
      Helper.print();
      setTimeout(() => {
        this.excelClick = true;
        this.excelClick2 = false;
        }, 2000);
      }, 1000);
  }

}