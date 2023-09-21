import { Component, OnInit } from '@angular/core';
import { LevelService } from 'src/app/account/services/level.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { SettingService } from '../../services/setting.service';
import { SettingTemplate } from '../../setting-template';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SystemSettingService } from 'src/app/core/services/system-setting.service';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.scss']
})
export class QualificationComponent extends SettingTemplate implements OnInit {

  qualificationType = null;
  academicYears: any = [];
  levels: any = [];
  filter: any = {};
  applicationService: any = ApplicationSettingService;


  constructor(public settingService: SettingService,  private globalService: GlobalService,private systemSettingService: SystemSettingService,
    public qualificationTypeService: SettingService) {
      
    super(settingService);

    this.baseUrl = "qualifications";
    this.settingService.baseUrl = "qualifications";
    this.requiredFields = ['name', 'grade'];
    this.loadSettings();
    this.getyaer()
 
    this.get();
 

    // init qualification type
    this.qualificationType = new SettingTemplate(this.qualificationTypeService);
    this.qualificationType.baseUrl = "qualification_types";
    this.qualificationType.requiredFields = ['name', 'level_id', 'academic_year_id', 'qualification_id', 'grade'];
    // this.qualificationType.filter = this.filter;

    this.qualificationType.get();

    //this.qualificationType;

  }

  searchQualificationType() {
    this.qualificationType.filter = this.filter;
    this.qualificationType.get();
  }
  loadSettings() {
    this.systemSettingService.getSystemSetting().subscribe((res: any)=>{
      this.filter.academic_year_id = res["current_academic_year"].id;
    });
  }
  ngOnInit() {
    this.loadSettings();
    this.getyaer()
    this.searchQualificationType()
    this.academicYears = this.applicationService.ACADEMIC_YEARS;

    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
  }
  yearss=[]
  getyaer(){
    
 
    this.globalService.get('academic_years').subscribe( (res: any) => {

      this.yearss =res
 
    });
  }

  action(res) {
    this.qualificationType.get();
  }

}
