import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Message } from '../../../shared/message';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';

@Component({
  selector: 'app-settingresult',
  templateUrl: './settingresult.component.html',
  styleUrls: ['./settingresult.component.scss']
})
export class SettingresultComponent implements OnInit {

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.getData()
  }
  form = new FormGroup({
    date: new FormControl('', Validators.required),
    date2: new FormControl('', Validators.required),

    namegrad: new FormControl('', Validators.required),
    namevice: new FormControl('', Validators.required),
    namemanger: new FormControl('', Validators.required),
    graduates_affair_en: new FormControl('', Validators.required),
    students_affair_en: new FormControl('', Validators.required),
    institute_dean_en: new FormControl('', Validators.required),

    year_id: new FormControl('', Validators.required),


   });

   formdata={}
   applicationService: any = ApplicationSettingService;

   onSubmit() {
console.log("dddddddddddddddddddd"+this.form.value.year_id)
this.formdata={
  "institute_recognition_date":this.form.value.date,
  "ministry_recognition_date":this.form.value.date2,
  "year_id": this.form.value.year_id,

  "graduates_affair":this.form.value.namegrad,
  "institute_dean":this.form.value.namevice,
  "students_affair":this.form.value.namemanger,
  "graduates_affair_en":this.form.value.graduates_affair_en,
  "institute_dean_en":this.form.value.institute_dean_en,
  "students_affair_en":this.form.value.students_affair_en,

}
     this.globalService.store("academic/graduation/settings/store",this.formdata).subscribe((res) => {
      const r: any = res;
      if (r.status == 1) {
        Message.success(r.message);
        this.form.reset();
        this.getData()

      }
      else{
        Message.error(r.message);

      }



     });
  }
  results :any=[]
getData(){
  this.globalService.get("academic/graduation/settings").subscribe((res) => {
    this.results = res;

   });
}
onUpdate(item:any){
  this.globalService.store("academic/graduation/settings/update/"+item.id,item).subscribe((res) => {
    const r: any = res;
    if (r.status == 1) {
      Message.success(r.message);


    }
    else{
      Message.error(r.message);

    }
   });
}
ondelete(item){
  this.globalService.store("academic/graduation/settings/delete/"+item.id,item).subscribe((res) => {
    const r: any = res;
    if (r.status == 1) {
      Message.success(r.message);
      this.form.reset();
      this.getData()

    }
    else{
      Message.error(r.message);

    }
   });
}
}
