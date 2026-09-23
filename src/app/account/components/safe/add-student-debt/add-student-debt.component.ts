import { Component, Input, OnInit } from '@angular/core';
import { StudentAccountService } from 'src/app/account/services/student-account.service';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';

@Component({
  selector: 'app-add-student-debt',
  templateUrl: './add-student-debt.component.html',
  styleUrls: ['./add-student-debt.component.scss']
})
export class AddStudentDebtComponent implements OnInit {

  doc: any = document;
  isSubmitted = false;
  item: any = {};

  @Input() safeObject: any;
  @Input() updateStudent: any;

  constructor(private studentAccountService: StudentAccountService) { }

  reset() {
    this.item = { value: null, notes: '' };
  }

  /** المبلغ الموجب يزيد المديونية و السالب يخصم منها */
  sendResource() {
    if (!this.item.value || !this.item.notes)
      return Message.error(Helper.trans('fill all data'));

    if (Number(this.item.value) === 0)
      return Message.error('المبلغ لا يمكن ان يكون صفرا');

    this.isSubmitted = true;
    this.studentAccountService.addStudentDebt({
      student_id: this.safeObject.id,
      value: this.item.value,
      notes: this.item.notes
    }).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
        this.doc.jquery('#addStudentDebtModal').modal('hide');
        this.updateStudent();
        this.reset();
      } else {
        Message.error(res.message);
      }
      this.isSubmitted = false;
    }, () => { this.isSubmitted = false; });
  }

  ngOnInit() {
    this.reset();
  }
}
