import { Component, OnInit } from '@angular/core';
 import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Message } from '../../../shared/message';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-payment-summer',
  templateUrl: './payment-summer.component.html',
  styleUrls: ['./payment-summer.component.scss']
})
export class PaymentSummerComponent implements OnInit {


  doc: any = document;


    constructor(private globalService: GlobalService) { }

    ngOnInit() {
      this.getData()
    }

    results :any=[]
  getData(){
    this.globalService.get("academic/summer/payments/reports/get").subscribe((res) => {
      this.results = res;

     });
  }
  print() {
    Helper.print();
  }

  exportExcel() {
    const filename = "مدفوعات  الترم الصيفى-"+new Date().toLocaleTimeString();
    this.doc.exportExcel(filename);
  }

  exportPdf() {
    const filename = "مدفوعات الترم الصيفى-"+new Date().toLocaleTimeString();
    this.doc.printPdf(filename);
  }
  }
