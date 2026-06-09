import { Component, OnInit } from '@angular/core';
import { idLocale } from 'ngx-bootstrap';
import { DoctorService } from 'src/app/academic/services/doctor.service';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-doctor-index',
  templateUrl: './doctor-index.component.html',
  styleUrls: ['./doctor-index.component.scss']
})
export class DoctorIndexComponent implements OnInit {

  doctors: any = [];
  doctor: any = {};
  users: any = [];
  updateView: any = null;
  $: any = $;

  constructor(private doctorService: DoctorService, private userService: UserService) {
    this.updateView = () => {
      this.loadDoctors();
    };
  }

  ngOnInit() {
    this.loadDoctors();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.get().subscribe((res: any) => {
      this.users = res;
    });
  }

  userName(userId: any): string {
    if (!userId) return '';
    const u = (this.users || []).find((x: any) => String(x.id) === String(userId));
    return u ? u.name : '';
  }

  showUpdateDoctorForm(doctor) {
    this.doctor = doctor;
    console.log(doctor.levels);
    // set select2
    setTimeout(() => {
      this.$('.level-select').val(doctor.levels);
      this.$('.level-select').select2();
      this.$('.division-select').val(doctor.divisions);
      this.$('.division-select').select2();
    }, 500);
    this.$('#doctorFormModal').modal('show');
  }

  showAddForm() {
    this.doctor = {};
    // set select2
    setTimeout(() => {
      this.$('.level-select').val(null).trigger('change');
      this.$('.level-select').select2();
      this.$('.division-select').val(null).trigger('change');
      this.$('.division-select').select2();
    }, 500);
    this.$('#doctorFormModal').modal('show');
  }

  performRemove(doctor, index) {
    this.doctorService.destroy(doctor.id).subscribe((res: any)=>{
      if (res.status == 1) {
        Message.success(res.message);
        this.doctors.splice(index, index+1);
      } else {
        Message.error(res.message);
      }
    });
  }

  remove(doctor, index) {
    var self = this;
    Message.confirm(Helper.trans('are you sure'), ()=>{
      self.performRemove(doctor, index);
    });
  }

  loadDoctors() {
    this.doctorService.get().subscribe((res)=>{
      this.doctors = res;
    });
  }
}
