import { Component, Input, OnInit } from '@angular/core';
import { DoctorService } from 'src/app/academic/services/doctor.service';
import { DivisionService } from 'src/app/account/services/division.service';
import { LevelService } from 'src/app/account/services/level.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {

  $: any = $;

  @Input() doctor: any;
  @Input() updateView: any;
  @Input() doctors: any[] = [];

  levels: any = [];
  divisions: any = [];
  users: any = [];
  isSubmitted = false;
  requiredFields = [
    'name',
    'phone',
    'username',
    'password',
  ];
  constructor(private doctorService: DoctorService, private userService: UserService) { }

  ngOnInit() {
    // set select2
    setTimeout(() => {
      this.$('.level-select').select2();
      this.$('.division-select').select2();
    }, 500);
    // load levels & divisions from cache
    this.levels = Cache.get(LevelService.LEVEL_PREFIX);
    this.divisions = Cache.get(DivisionService.DIVISION_PREFIX);
    // load users
    this.userService.get().subscribe((res: any) => {
      this.users = res;
    });
  }

  validate() {
    let valid = true;
    this.requiredFields.forEach(element => {
      if (!this.doctor[element])
        valid = false;
    });
    return valid;
  }

  availableUsers() {
    const currentId = this.doctor && this.doctor.id;
    const usedIds = (this.doctors || [])
      .filter(d => d.user_id && d.id !== currentId)
      .map(d => String(d.user_id));
    return (this.users || []).filter(u => !usedIds.includes(String(u.id)));
  }

  send() {
    if (!this.validate()) {
      return Message.error(Helper.trans('fill all required data'));
    }

    this.doctor.levels = this.$('.level-select').val();
    this.doctor.divisions = this.$('.division-select').val();
    if (!this.doctor.user_id) {
      this.doctor.user_id = null;
    }
    if (this.doctor.id) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    this.isSubmitted= true;

    this.doctorService.store(this.doctor).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
        this.doctor = {};
      }
      else {
        Message.error(res.message);
      }
      this.isSubmitted = false;
      this.updateView();
    });
  }

  update() {
    this.isSubmitted= true;
    this.doctorService.update(this.doctor).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
      }
      else {
        Message.error(res.message);
      }
      this.isSubmitted = false;
      this.updateView();
    });
  }

}
