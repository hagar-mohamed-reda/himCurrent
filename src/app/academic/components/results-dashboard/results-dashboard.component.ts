import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DivisionService } from 'src/app/account/services/division.service';
import { LevelService } from 'src/app/account/services/level.service';
import { TermService } from 'src/app/account/services/term.service';
import { ApplicationSettingService } from 'src/app/adminision/services/application-setting.service';
import { Cache } from 'src/app/shared/cache';
import { Helper } from 'src/app/shared/helper';
import { Message } from 'src/app/shared/message';
import { Request } from 'src/app/shared/request';
import { ReportServiceService } from '../../services/report-service.service';
import { RESULTS_DASHBOARD_PRINT_CSS } from './results-dashboard.styles';

@Component({
  selector: 'app-results-dashboard',
  templateUrl: './results-dashboard.component.html',
  styleUrls: ['./results-dashboard.component.scss']
})
export class ResultsDashboardComponent implements OnInit {

  $: any = $;
  doc: any = document;
  applicationService: any = ApplicationSettingService;

  filter: any = {};
  // نسخة من الفلاتر وقت تحميل البيانات - حتى لا تتغير عناوين الجداول
  // بمجرد تغيير القائمة قبل الضغط على "عرض الاحصائيات"
  appliedFilter: any = {};
  levels: any = [];
  divisions: any = [];
  terms: any = [];

  data: any = null;
  isLoading = false;
  today = new Date();

  // اثناء الطباعة نستبدل محتوى #printable بنماذج تقييم المقررات
  // و نعيده بعدها. التبديل يتم في الـ DOM و ليس بالـ CSS لان printJS
  // ينسخ خاصية display المحسوبة داخل عنصر style فيتجاهل @media print.
  printMode = false;

  // بحث داخل جدول المقررات (لا يعيد الطلب للسيرفر) - الفصل صار ضمن فلاتر الاعلى
  courseSearch = '';

  // نتيجة الفلترة و مجاميعها محسوبة مسبقا - لا تُحسب داخل getter
  // لان القالب يقرأها عشرات المرات في كل دورة كشف تغيّر و عدد المقررات قد يتجاوز 400
  courses: any = [];
  totals: any = {};        // مجاميع المقررات المعروضة بعد فلتر الصفحة (تذييل الجدول)
  grandTotals: any = {};   // مجاميع كل مقررات العام (كروت المؤشرات - لا تتأثر بفلتر الصفحة)

  constructor(
    private titleService: Title,
    private reportService: ReportServiceService,
    private applicationSettingService: ApplicationSettingService
  ) {
    this.titleService.setTitle('HIM - احصائيات النتائج');
    this.applicationSettingService.queueRequests();
    Request.fire(false, () => {});
  }

  ngOnInit() {
    this.levels = Cache.get(LevelService.LEVEL_PREFIX) || [];
    this.divisions = Cache.get(DivisionService.DIVISION_PREFIX) || [];
    this.terms = Cache.get(TermService.TERPM_PREFIX) || [];
  }

  load() {
    if (!this.filter.year_id) {
      return Message.error('اختر العام الدراسي');
    }

    this.isLoading = true;
    this.data = null;
    this.courses = [];
    this.totals = {};
    this.grandTotals = {};

    this.reportService.getResultsStatistics(this.filter).subscribe(
      (res: any) => {
        this.isLoading = false;

        // responseJson(0, ...) يرجع status = 0 عند الخطأ
        if (res && res.status === 0) {
          return Message.error(res.message);
        }

        this.data = res;
        this.appliedFilter = Object.assign({}, this.filter);
        this.grandTotals = this.buildTotals(res.courses || []);
        this.applyCourseFilter();

        // القالب لم يُرسم بعد في هذه اللحظة فننتظر دورة واحدة قبل حقن الستايل
        setTimeout(() => this.injectPrintStyles(), 0);
      },
      () => {
        this.isLoading = false;
        Message.error('تعذر تحميل الاحصائيات');
      }
    );
  }

  /**
   * يحقن ستايل التقرير داخل #printable وقت التشغيل.
   * لا يمكن وضعه في القالب لان انجولار يستخرج وسم <style> منه،
   * و لا في ملف scss لان printJS لا يحمّل ستايلات الكومبوننت.
   */
  private injectPrintStyles() {
    const host = document.getElementById('printable');

    if (!host || host.querySelector('style[data-rd-styles]')) {
      return;
    }

    const style = document.createElement('style');
    style.setAttribute('data-rd-styles', '1');
    style.appendChild(document.createTextNode(RESULTS_DASHBOARD_PRINT_CSS));
    host.insertBefore(style, host.firstChild);
  }

  /** يعيد حساب المقررات المعروضة و مجاميعها بعد اي تغيير في فلاتر الصفحة */
  applyCourseFilter() {
    if (!this.data) {
      this.courses = [];
      this.totals = {};
      return;
    }

    let rows = this.data.courses;

    if (this.courseSearch && this.courseSearch.trim()) {
      const key = this.courseSearch.trim();
      rows = rows.filter(c =>
        (c.name && c.name.indexOf(key) >= 0) ||
        (c.code && String(c.code).indexOf(key) >= 0)
      );
    }

    this.courses = rows;
    this.totals = this.buildTotals(rows);
  }

  private buildTotals(rows) {
    const fields = ['registered', 'satExam', 'absent', 'deprived', 'withdrawn', 'notAttended', 'passed', 'failed'];
    const totals: any = { grades: {} };

    fields.forEach(field => {
      totals[field] = rows.reduce((sum, c) => sum + (c[field] || 0), 0);
    });

    (this.data.gradeKeys || []).forEach(gradeKey => {
      totals.grades[gradeKey] = rows.reduce((sum, c) => sum + ((c.grades && c.grades[gradeKey]) || 0), 0);
    });

    totals.passRate = totals.satExam > 0 ? Math.round(totals.passed / totals.satExam * 1000) / 10 : 0;
    totals.failRate = totals.satExam > 0 ? Math.round(totals.failed / totals.satExam * 1000) / 10 : 0;

    return totals;
  }

  /**
   * الطباعة تُخرج نموذج "نتائج تقييم الطلاب" لكل مقرر معروض،
   * بينما تبقى الشاشة على شكل لوحة المعلومات كما هي.
   */
  print() {
    if (!this.courses.length) {
      return Message.error('لا توجد مقررات لطباعتها');
    }

    this.printMode = true;
    this.waitForForms(0);
  }

  /**
   * رسم مئات النماذج يستغرق اكثر من دورة واحدة، و printJS ينسخ الـ DOM لحظة
   * استدعائه، فننتظر اكتمال الرسم فعليا بدل الاعتماد على مهلة ثابتة.
   */
  private waitForForms(attempt) {
    const rendered = document.querySelectorAll('#printable .rd-form').length;

    if (rendered < this.courses.length && attempt < 60) {
      return setTimeout(() => this.waitForForms(attempt + 1), 100);
    }

    this.sendToPrinter();
  }

  private sendToPrinter() {
    const printJS = (window as any).printJS;

    if (!printJS) {
      Helper.print();
    } else {
      printJS({
        printable: 'printable',
        type: 'html',
        // مهم: الافتراضي ينسخ الستايل المحسوب سطريا و يفرض
        // font-size:12pt و max-width:800px على كل عنصر فيخرب النماذج.
        scanStyles: false,
        css: ['assets/css/bootstrap.min.css', 'assets/css/w3.css'],
        onPrintDialogClose: () => { this.restoreView(); }
      });
    }

    // printJS ينسخ العناصر قبل فتح الحوار، فاعادة الشاشة الان لا تؤثر على المطبوع.
    // هذه شبكة امان لو لم يُستدعَ onPrintDialogClose في بعض المتصفحات.
    setTimeout(() => this.restoreView(), 4000);
  }

  private restoreView() {
    if (!this.printMode) return;
    this.printMode = false;
    setTimeout(() => this.injectPrintStyles(), 0);
  }

  /** ترتيب التقديرات العربية في النموذج: ممتاز ← مقبول ثم راسب في الاخر */
  get arabicKeysForPrint() {
    const keys = (this.data && this.data.arabicKeys) ? this.data.arabicKeys.slice() : [];
    if (!keys.length) return [];

    const failLabel = keys[keys.length - 1];          // "راسب" دائما الاخير من السيرفر
    const passLabels = keys.slice(0, keys.length - 1).reverse();

    return passLabels.concat([failLabel]);
  }

  /** ترتيب رموز التقديرات في النموذج: D ← A+ (يقرأ يمينا لشمال) */
  get gradeKeysForPrint() {
    return (this.data && this.data.gradeKeys) ? this.data.gradeKeys : [];
  }

  /* ---------------- مساعدات العرض ---------------- */

  get overall() {
    return this.data ? this.data.overall : null;
  }

  /** الفصل المطبّق فعليا على البيانات المعروضة (وليس المختار في القائمة قبل الضغط على عرض) */
  get appliedTermId() {
    return this.appliedFilter.term_id || null;
  }

  get termName() {
    if (!this.appliedTermId) return 'كل الفصول';
    const term = this.terms.filter(t => t.id == this.appliedTermId)[0];
    return term ? term.name : '';
  }

  /** الفصول المعروضة في الجداول و الرسوم - فصل واحد عند الفلترة و الثلاثة عند "كل الفصول" */
  get shownBuckets() {
    if (!this.overall) return [];

    if (this.appliedTermId == 1) return [{ key: 'term1', label: 'الفصل الأول' }];
    if (this.appliedTermId == 2) return [{ key: 'term2', label: 'الفصل الثاني' }];
    if (this.appliedTermId == 3) return [{ key: 'term3', label: 'الفصل الصيفي' }];

    return [
      { key: 'term1', label: 'الفصل الأول' },
      { key: 'term2', label: 'الفصل الثاني' },
      { key: 'year',  label: 'السنة كاملة' }
    ];
  }

  /** المؤشر الرئيسي في الكروت: الفصل المختار او السنة كاملة */
  get mainBucket() {
    if (!this.overall) return null;
    const buckets = this.shownBuckets;
    return this.overall[buckets[buckets.length - 1].key] || this.overall.year;
  }

  get mainBucketLabel() {
    const buckets = this.shownBuckets;
    return buckets.length ? buckets[buckets.length - 1].label : 'السنة كاملة';
  }

  get settings() {
    return (this.data && this.data.settings) ? this.data.settings : {};
  }

  get levelName() {
    if (!this.appliedFilter.level_id) return 'كل المستويات';
    const level = this.levels.filter(l => l.id == this.appliedFilter.level_id)[0];
    return level ? level.name : '';
  }

  get divisionName() {
    if (!this.appliedFilter.division_id) return 'كل التخصصات';
    const division = this.divisions.filter(d => d.id == this.appliedFilter.division_id)[0];
    return division ? division.name : '';
  }

  termLabel(termId) {
    if (termId == 1) return 'الفصل الأول';
    if (termId == 2) return 'الفصل الثاني';
    if (termId == 3) return 'الصيفي';
    return 'ترم ' + termId;
  }

  /** اعلى قيمة في توزيع - لرسم الاعمدة بنسبة صحيحة */
  maxOf(rows) {
    if (!rows || !rows.length) return 1;
    return Math.max.apply(null, rows.map(r => r.count)) || 1;
  }

  barHeight(row, rows) {
    const max = this.maxOf(rows);
    // حد ادنى 2% حتى تظهر الاعمدة الصغيرة
    return Math.max(2, Math.round(row.count / max * 100));
  }

  /** لون العمود حسب موقع التقدير في السلم */
  gradeColor(index, total) {
    const palette = ['#c2410c', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a', '#0d9488', '#0369a1'];
    if (total <= 1) return palette[palette.length - 1];
    const slot = Math.round(index / (total - 1) * (palette.length - 1));
    return palette[slot];
  }

  /** لون مؤشر النسبة - اخضر للنجاح العالي و احمر للمنخفض */
  rateColor(rate) {
    if (rate >= 90) return '#16a34a';
    if (rate >= 75) return '#65a30d';
    if (rate >= 60) return '#d97706';
    return '#dc2626';
  }
}
