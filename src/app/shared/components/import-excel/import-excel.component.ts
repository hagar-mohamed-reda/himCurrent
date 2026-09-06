import { Component, Input, OnInit } from '@angular/core';
import { Helper } from '../../helper';
import { Message } from '../../message';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.scss']
})
export class ImportExcelComponent implements OnInit {

  $: any = $;
  doc: any = document;
  resource: any = {};
  isSubmitted = false;
  excelRows: any = [];

  @Input() course_id: any;
  @Input() apiUrl: any;
  @Input() data: any;
  @Input() action: any;
  /** [رقم عمود البداية, رقم عمود النهاية] - يفعّل تصحيح قلب اليوم بالشهر */
  @Input() dateRange: any;

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
  }

  /**
   * عرض خلية المعاينة كما كُتبت في الملف.
   *
   * الخلايا التي حوّلها الاكسل الى تاريخ حقيقي تصل من readXlsxFile
   * ككائن Date، و الاستيفاء المباشر يطبعه بصيغته الطويلة
   * "Sat Feb 07 2026 14:00:00 GMT+0200 (...)" بينما تظهر الخلية
   * النصية المجاورة "20/06/2026". نوحّد الشكل الى يوم/شهر/سنة.
   */
  cell(value: any) {
    if (value instanceof Date) {
      const day = ('0' + value.getDate()).slice(-2);
      const month = ('0' + (value.getMonth() + 1)).slice(-2);
      return `${day}/${month}/${value.getFullYear()}`;
    }

    return value;
  }

  loadFile(ev) {
    Helper.loadImage(ev, 'file', this.resource);
    this.readExcelFile(this.resource.file);
    console.log(this.resource);
  }

  /**
   * read excel file
   */
  readExcelFile(file) {
    var self = this;
    this.doc.readXlsxFile(file).then((rows) => {
      console.log(rows);
      if (self.dateRange)
        rows.forEach((row) => self.fixSwappedDates(row));
      self.excelRows = rows;
    })
  }

  /**
   * تصحيح قلب اليوم بالشهر في صف واحد.
   *
   * الملف يُكتب بصيغة يوم/شهر/سنة، لكن الاكسل يقرأ الخلية على انها
   * شهر/يوم كلما استطاع ذلك (اي حين يكون الرقمان اقل من 13) فيحولها
   * الى تاريخ حقيقي بيوم و شهر مقلوبين. لهذا تمر 20/06/2026 سليمة
   * كنص - لان 20 اكبر من 12 - بينما تتحول 02/07/2026 الى 7 فبراير.
   *
   * لا نقلب الا حين تتحقق ثلاثة شروط معا: ان يكون الاكسل هو من حوّل
   * الخلية (اي وصلت كائن Date لا نصا)، و ان يكون الترتيب مستحيلا
   * (نهاية قبل بداية)، و ان يصلح القلب هذا الترتيب. تاريخ صحيح لا
   * يحقق الشرط الثاني اصلا فلا يُمس.
   *
   * نفس المنطق مطبق في ArmyDegreeImport في الباك، و هذا هنا للمعاينة
   * فقط حتى يرى المستخدم ما سيُحفظ لا ما في الملف.
   */
  fixSwappedDates(row: any) {
    const startIndex = this.dateRange[0];
    const endIndex = this.dateRange[1];

    const start = this.toDate(row[startIndex]);
    const end = this.toDate(row[endIndex]);

    if (!start || !end || end >= start)
      return;

    if (row[endIndex] instanceof Date) {
      const swapped = this.swapDayMonth(end);
      if (swapped && swapped >= start) {
        row[endIndex] = swapped;
        return;
      }
    }

    if (row[startIndex] instanceof Date) {
      const swapped = this.swapDayMonth(start);
      if (swapped && swapped <= end)
        row[startIndex] = swapped;
    }
  }

  /**
   * الخلية النصية تصل كما كُتبت بصيغة يوم/شهر/سنة، و المحوّلة تصل
   * كائن Date. ما عدا ذلك ليس تاريخا.
   */
  toDate(value: any) {
    if (value instanceof Date)
      return value;

    const parts = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec(String(value || ''));
    if (!parts)
      return null;

    const date = new Date(+parts[3], +parts[2] - 1, +parts[1]);
    return date.getDate() == +parts[1] ? date : null;
  }

  /** تبديل اليوم بالشهر، و يرجع null اذا كان الناتج تاريخا غير موجود */
  swapDayMonth(date: any) {
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if (day > 12)
      return null;

    const swapped = new Date(date.getFullYear(), day - 1, month);
    return swapped.getDate() == month ? swapped : null;
  }


  sendFile() {
    if(this.excelRows.length == 0) return Message.error("اختار الملف اولا")
    this.isSubmitted = true;
    if(this.course_id != null){
      this.resource.course_id = this.course_id;
      this.globalService.store(this.apiUrl, Helper.toFormData(this.resource)).subscribe((res: any) => {
        if (res.status == 1) {
          Message.success(res.message);
          this.isSubmitted = false;
          if (this.action)
            this.action();
        } else {
          Message.error(res.message);
        }
        this.isSubmitted = false;
      });
    } else {
    this.globalService.store(this.apiUrl, Helper.toFormData(this.resource)).subscribe((res: any) => {
      if (res.status == 1) {
        Message.success(res.message);
        this.isSubmitted = false;
        if (this.action)
          this.action();
      } else {
        Message.error("ارفع الملف أولا");
      }
      this.isSubmitted = false;
    });
  }

  }

}
