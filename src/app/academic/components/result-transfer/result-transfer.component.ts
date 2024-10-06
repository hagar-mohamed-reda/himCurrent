import { Component, OnInit } from '@angular/core';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { StudentResultService } from '../../services/student-result.service';
import { Cache } from 'src/app/shared/cache';
import { LevelService } from '../../../account/services/level.service';

@Component({
  selector: 'app-result-transfer',
  templateUrl: './result-transfer.component.html',
  styleUrls: ['./result-transfer.component.scss']
})
export class ResultTransferComponent implements OnInit {

  public currentStep = 1;
  public result: any = [];
  public loading = false;
  public doc: any = document;
  levels: any = [];
  filter: any = {};
  level_id_filter: any;
  constructor(private studentResultService: StudentResultService) { 

    this.levels = Cache.get(LevelService.LEVEL_PREFIX);

  }

  ngOnInit() {
  }

  goToStep2() {
    this.currentStep = 2;
  }

  goToStep(step) {
    this.currentStep = step;
  }

  public start() {
    // start looding
    this.loading = true;
    this.currentStep = 3;
    let self = this;
    this.studentResultService.startResultTransfer(this.filter).subscribe(function(r: any){
      if (r.status == 1) {
        Message.success(r.message);
      } else {
        Message.success(r.message);
      }
      self.result = r.data;
      self.loading = false;
      self.goToStep(4);
      console.log(self.currentStep);
    
    }, (error) => {
      this.loading = false;
      this.currentStep = 2;

      Message.error("هناك خطأ");
    }
  );
  }

  print() {
    Helper.print();
  }

  exportExcel() {
    const filename = "الطلاب الغير مطابقين للشروط" + "-" + new Date().toLocaleTimeString();
    this.doc.exportExcel(filename);
  }
}
