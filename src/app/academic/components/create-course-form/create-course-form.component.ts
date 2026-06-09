import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LevelService } from 'src/app/account/services/level.service';
import { StudentServiceService } from 'src/app/account/services/student-service.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { GlobalService } from 'src/app/shared/services/global.service';
import { StudentService } from 'src/app/student/services/student.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-create-course-form',
  templateUrl: './create-course-form.component.html',
  styleUrls: ['./create-course-form.component.scss']
})
export class CreateCourseFormComponent implements OnInit, OnChanges {

  @Input() course: any;
  @Input() updateView: any;
  @Input() categories: any;

  $: any = $;
  terms: any = [];
  types: any = [{id:0 , name:"اختياري"} , {id:1 , name:"اجباري"}]
  courses: any = [];
  divisions: any = [];
  levels: any = [];
  services: any = [];
  isSubmitted = false;
  applicationSettting: any = ApplicationSettingService;
  requiredFields = [
    'name',
    'code',
    // 'stage',
    /*
    'year_work_degree',
    'practical_degree',
    'academic_degree',
    'small_degree',
    'large_degree',
    'book_price',
    'failed_degree'
    */
    'division_id',
    'level_id',
    'credit_hour',
    // 'subject_category_id',
    // 'type',
    'term',
  ];

  constructor(
    private termService:TermService,
    private courseService: CourseService,
    private globalService: GlobalService,
    private applicationSetting: ApplicationSettingService,
    private studentService: StudentServiceService) { }

  ngOnInit() {
    // set select2
    setTimeout(() => {
      this.$('.select2').select2();
    }, 500);
    // load open couress for this year and term
    this.loadCourses();
    // load divisions
    this.globalService.get('account/divisions').subscribe((res) => {
      this.divisions = res;
    });
    // load levels
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    this.terms = Cache.get(TermService.TERPM_PREFIX);

    // load student services
    this.loadServices();
  }

  // ngOnChanges() {
  //   setTimeout(() => {
  //     this.$('.select2').select2();
  //   }, 500);
  // }

  loadCourses() {
    this.courseService.get().subscribe((res) => {
      this.courses = res;
          this.$('#courseFormModal').modal('hide');

    });
  }

  loadServices() {
    this.studentService.get().subscribe((res) => {
      this.services = res;
    });
  }
ngOnChanges() {
  setTimeout(() => {
    this.$('.select2').select2();

    if (this.course && this.course.prerequsites) {
      let selectedValues: string[] = this.course.prerequsites
        .split(',')
        .map((x: string) => x.trim());

      this.$('.prerequsited')
        .val(selectedValues)
        .trigger('change');
    }
  }, 500);
}
  validate() {
    let valid = true;
    this.requiredFields.forEach(element => {
      if (!this.course[element])
        valid = false;
    });
    return valid;
  }

send() {
  if (!this.validate()) {
    return Message.error(Helper.trans('fill all required data'));
  }

  let selectedValues = this.$('.prerequsited').val();

  this.course.prerequsites = selectedValues ? selectedValues : [];

  if (this.course.id) {
    this.update();
  } else {
    this.save();
  }
}

  save() {
    this.isSubmitted= true;

    this.courseService.store(this.course).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
        this.course = {};
      }
      else {
        Message.error(res.message);
      }
      this.isSubmitted = false;
      this.updateView();
      this.loadCourses();
    });
  }

  // update() {
  //   this.isSubmitted= true;
  //   this.courseService.update(this.course).subscribe((res: any) => {
  //     if (res.status == 1) {
  //       Message.success(res.message);
  //         setTimeout(() => {
  //       if (this.course && this.course.prerequsites) {

  //         let selectedValues: string[] =
  //           typeof this.course.prerequsites === 'string'
  //           ? this.course.prerequsites.split(',').map((x: string) => x.trim())
  //           : this.course.prerequsites;

  //         this.$('.prerequsited')
  //           .val(selectedValues)
  //           .trigger('change');
  //       }
  //     }, 200);
  //     }
  //     else {
  //       Message.error(res.message);
  //     }
  //     this.isSubmitted = false;
  //     this.updateView();
  //     this.loadCourses();
  //   });
  // }

update() {
  this.isSubmitted = true;

  this.courseService.update(this.course).subscribe((res: any) => {

    if (res.status == 1) {
      Message.success(res.message);

      let currentPrerequsites = this.course.prerequsites;

      this.updateView();
      this.loadCourses();

      setTimeout(() => {

        this.course.prerequsites = currentPrerequsites;

        this.$('.prerequsited').select2();

        this.$('.prerequsited')
          .val(
            Array.isArray(currentPrerequsites)
              ? currentPrerequsites
              : currentPrerequsites.split(',').map((x: string) => x.trim())
          )
          .trigger('change');

      }, 500);

    } else {
      Message.error(res.message);
    }
 
    this.isSubmitted = false;
  });
}
}
