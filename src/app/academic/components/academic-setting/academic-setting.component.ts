import { Component, OnInit } from '@angular/core';
import { HashTable } from 'angular-hashtable';
import { LevelService } from 'src/app/account/services/level.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { AcademicSettingService } from '../../services/academic-setting.service';

@Component({
  selector: 'app-academic-setting',
  templateUrl: './academic-setting.component.html',
  styleUrls: ['./academic-setting.component.scss']
})
export class AcademicSettingComponent implements OnInit {

  $: any = $;
  settings = [];
  levels = [];
  settingHash = new HashTable();
  rPaymentSettings = new HashTable();
  unrPaymentSettings = new HashTable();
  isSubmitted = false;
  password: any = null;
  level_id: any = null;
  action = null;

  constructor(private academicSettingService: AcademicSettingService) {
    this.initSettings();
  }

  ngOnInit() {
    this.loadSettings();
    this.loadLevels();
  }

  loadLevels() {
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
  }

  initSettings() {

    this.settings = [
      {id: 1, value: this.settingHash.get(1)},
      {id: 2, value: this.settingHash.get(2)},
      {id: 3, value: this.settingHash.get(3)},
      {id: 4, value: this.settingHash.get(4)},
      {id: 5, value: this.settingHash.get(5)},
      {id: 6, value: this.settingHash.get(6)},
      {id: 7, value: this.settingHash.get(7)},
      {id: 8, value: this.settingHash.get(8)},
      {id: 9, value: this.settingHash.get(9)},
      {id: 10, value: this.settingHash.get(10)},
      {id: 11, value: this.settingHash.get(11)},
      {id: 12, value: this.settingHash.get(12)},
      {id: 13, value: this.settingHash.get(13)},
        //r payment settings

        {id: 14, value: this.arrRes[0],idd: this.arrResid[0] || 0},
        {id: 15, value: this.arrRes[1], idd: this.arrResid[1] || 0},
        {id: 16, value: this.arrRes[2] , idd: this.arrResid[2]|| 0},
        {id: 17, value: this.arrRes[3] , idd: this.arrResid[3]|| 0},
        {id: 18, value: this.arrRes[4] , idd: this.arrResid[4] || 0},

      // {id: 14, value: this.rPaymentSettings.get(1) || 0},
      // {id: 15, value: this.rPaymentSettings.get(2) || 0},
      // {id: 16, value: this.rPaymentSettings.get(3) || 0},
      // {id: 17, value: this.rPaymentSettings.get(4) || 0},
      // {id: 18, value: this.rPaymentSettings.get(5) || 0},
      //unr payment settings

      {id: 19, value:  this.arr[0], idd: this.arrids[0] || 0},
      {id: 20, value: this.arr[1] , idd: this.arrids[1]|| 0},
      {id: 21, value: this.arr[2] , idd: this.arrids[2]|| 0},
      {id: 22, value:  this.arr[3] , idd: this.arrids[3]|| 0},
      {id: 23, value:  this.arr[4], idd: this.arrids[4]|| 0}

      // {id: 19, value: this.unrPaymentSettings.get(6) || 0},
      // {id: 20, value: this.unrPaymentSettings.get(7) || 0},
      // {id: 21, value: this.unrPaymentSettings.get(8) || 0},
      // {id: 22, value: this.unrPaymentSettings.get(9) || 0},
      // {id: 23, value: this.unrPaymentSettings.get(10) || 0}
    ];

    console.log(this.settings);

  }

  /**
   * load all academic settings
   */
  loadSettings() {
    this.settingHash = new HashTable();
    this.academicSettingService.get().subscribe((res: any) => {
      res.forEach(element => {
        this.settingHash.put(element.id, element.value);
      });
      this.getPaymentSettings();

    });
  }

  /**
   * update all settings of academic
   */
  updateSetting() {

    const academicWithoutPaymentSettingsLength = 13
    let data = {
      settings: this.settings.slice(0 , academicWithoutPaymentSettingsLength)
    };
    const paymentData = this.settings.slice(academicWithoutPaymentSettingsLength , this.settings.length)

    const paymentSettings = []

    paymentData.forEach(element => {
      element.id = element.id - data.settings.length
      paymentSettings.push(element)
    });


    this.isSubmitted = true;
    this.academicSettingService.update(data).subscribe((res: any) => {
      if (res.status == 1)
        Message.success(res.message);
      else
        Message.error(res.message);

      this.isSubmitted = false;
    });

    this.academicSettingService.updatePaymentSettings(paymentSettings).subscribe(res => {
    })
  }
arr:any=[]
arrRes:any=[]

arrids:any=[]
arrResid:any=[]
 object1:any={}
 object2:any={}

  getPaymentSettings(){

    this.object1 ={}
    this.object2={}
    this.arr=[]
    this.arrRes =[]
    this.arrids=[]
    this.arrResid =[]
    this.academicSettingService.getAcademicPaymentSettings().subscribe((res : any) => {
      const r = res.restricted;
      const unr = res.unrestricted;
      r.forEach(i => {


        this.rPaymentSettings.put(i.id , i.value)
        this.arrRes.push( i.value)
        this.arrResid.push( i.id)

      })
      debugger
      unr.forEach( unr=> {

        this.unrPaymentSettings.put(unr.id , unr.value)
        this.arr.push( unr.value)
        this.arrids.push( unr.id)

      })
console.log(this.arr)
      this.initSettings();

    })
  }

  /**
   * update all settings of academic
   */
  publishResult() {
    if (!this.password || !this.level_id) {
      return Message.error(Helper.trans('fill all data'));
    }

    let data = {
      action: this.action,
      level_id: this.level_id,
      password: this.password
    };
    this.isSubmitted = true;
    this.academicSettingService.updatePublishResult(data).subscribe((res: any) => {
      if (res.status == 1)
        Message.success(res.message);
      else
        Message.error(res.message);

      this.isSubmitted = false;
    });
  }

  /**
   * show modal of publish result
   *
   */
  showPublishResultModal(action) {
    this.action = action;
    this.$('#publishResultModal').modal('show');
  }

}
