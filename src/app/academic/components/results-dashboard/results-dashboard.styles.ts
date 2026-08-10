/**
 * ستايل تقرير لوحة الاحصائيات.
 *
 * مكتوب هنا و ليس في ملف scss لان printJS يطبع محتوى #printable فقط
 * و لا يحمّل ستايلات الكومبوننت، كما ان انجولار يستخرج وسم <style> من القالب
 * و يحوّله الى ستايل مُنطّق (scoped) فلا يصل الى نافذة الطباعة.
 * لذلك يُحقن هذا النص وقت التشغيل داخل #printable.
 */
export const RESULTS_DASHBOARD_PRINT_CSS = `
.rd-wrap { direction: rtl; font-family: "Segoe UI", Tahoma, Arial, sans-serif; color: #1f2937; }
.rd-wrap * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

.rd-head { display: flex; align-items: center; justify-content: space-between;
           border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 14px; }
.rd-head .rd-org { text-align: center; font-weight: 700; font-size: 14px; line-height: 1.7; }
.rd-head .rd-title { text-align: center; }
.rd-head .rd-title h2 { margin: 0; font-size: 20px; font-weight: 800; color: #1e3a8a; }
.rd-head .rd-title .rd-sub { font-size: 12px; color: #6b7280; margin-top: 4px; }

.rd-chips { text-align: center; margin-bottom: 16px; }
.rd-chip { display: inline-block; background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe;
           border-radius: 14px; padding: 3px 14px; margin: 0 4px; font-size: 12px; font-weight: 700; }

.rd-cards { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
.rd-card { flex: 1 1 150px; border-radius: 10px; padding: 12px 10px; text-align: center;
           border: 1px solid #e5e7eb; background: #fff; }
.rd-card .rd-card-label { font-size: 12px; color: #6b7280; font-weight: 600; }
.rd-card .rd-card-value { font-size: 26px; font-weight: 800; line-height: 1.3; }
.rd-card .rd-card-note { font-size: 11px; color: #9ca3af; }
.rd-card-blue  { background: #eff6ff; border-color: #bfdbfe; }
.rd-card-green { background: #f0fdf4; border-color: #bbf7d0; }
.rd-card-red   { background: #fef2f2; border-color: #fecaca; }
.rd-card-amber { background: #fffbeb; border-color: #fde68a; }

.rd-panels { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
.rd-panel { flex: 1 1 320px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; background: #fff; }
.rd-panel h4 { margin: 0 0 12px; font-size: 14px; font-weight: 800; color: #1e3a8a;
               border-right: 4px solid #1e3a8a; padding-right: 8px; }

.rd-chart { display: flex; align-items: flex-end; justify-content: space-around;
            height: 150px; border-bottom: 2px solid #d1d5db; padding: 0 4px; }
.rd-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center;
              justify-content: flex-end; height: 100%; margin: 0 3px; }
.rd-bar-val { font-size: 11px; font-weight: 700; margin-bottom: 3px; }
.rd-bar { width: 100%; max-width: 46px; border-radius: 4px 4px 0 0; }
.rd-bar-lbl { font-size: 11px; font-weight: 700; margin-top: 5px; text-align: center; }

.rd-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px; }
.rd-table th, .rd-table td { border: 1px solid #cbd5e1; padding: 5px 6px;
                             text-align: center; vertical-align: middle; }
.rd-table thead th { background: #1e3a8a; color: #fff; font-weight: 700; font-size: 11px; }
.rd-table thead tr.rd-sub-head th { background: #3b5bab; font-size: 10px; }
.rd-table tbody tr:nth-child(even) { background: #f8fafc; }
.rd-table tfoot td { background: #e2e8f0; font-weight: 800; }
.rd-table td.rd-name { text-align: right; }

.rd-sec { font-size: 15px; font-weight: 800; color: #1e3a8a; margin: 22px 0 8px;
          border-right: 5px solid #1e3a8a; padding-right: 9px; }

.rd-pill { display: inline-block; min-width: 48px; border-radius: 10px; padding: 1px 6px;
           color: #fff; font-weight: 700; font-size: 11px; }

.rd-sign { display: flex; justify-content: space-around; margin-top: 34px;
           text-align: center; font-size: 13px; font-weight: 700; }
.rd-sign div { flex: 1; }
.rd-sign .rd-sign-line { margin-top: 34px; border-top: 1px dotted #6b7280; width: 70%;
                         margin-right: auto; margin-left: auto; }

.rd-scroll { overflow-x: auto; }

@media print {
    .rd-scroll { overflow: visible !important; }
    .rd-table { font-size: 9px; page-break-inside: auto; }
    .rd-table th, .rd-table td { padding: 2px 3px; }
    .rd-table tr { page-break-inside: avoid; }
    .rd-sec { page-break-after: avoid; }
    .rd-panel, .rd-card { break-inside: avoid; }
}

/* ==========================================================================
   نموذج "نتائج تقييم الطلاب" - نموذج مستقل لكل مقرر عند الطباعة
   ========================================================================== */

.rd-forms { direction: rtl; font-family: "Segoe UI", Tahoma, Arial, sans-serif; color: #000; }

.rd-form { page-break-after: always; break-after: page; padding: 4px 0 0; }
.rd-form:last-child { page-break-after: auto; break-after: auto; }

.rd-form-tbl { width: 100%; border-collapse: collapse; margin-bottom: 0; table-layout: fixed; }
.rd-form-tbl td { border: 1px solid #000; padding: 5px 7px; font-size: 12px; vertical-align: middle; }

.rd-form-title { background: #a6a6a6; text-align: center; font-weight: 700; font-size: 15px; }
.rd-form-sub   { background: #f2f2f2; text-align: center; font-weight: 700; font-size: 13px; }
.rd-form-hd    { background: #f2f2f2; text-align: center; font-weight: 700; }

.rd-form-lbl { font-weight: 700; text-align: right; width: 46%; }
.rd-form-val { text-align: center; font-weight: 700; }

/* صفوف جداول التقديرات: خانة العنوان ثابتة و الباقي يتوزع بالتساوي */
.rd-form-tbl .rd-form-hd, .rd-form-tbl .rd-form-val { width: auto; }

.rd-muted { font-weight: 400; font-size: 10px; color: #444; }

.rd-form-note { color: #c00000; font-weight: 700; font-size: 10px;
                border: 1px solid #000; border-top: 0; margin: 0; padding: 4px 7px; }

.rd-form-tbl-alt td { color: #c00000; }
.rd-form-tbl-alt .rd-form-hd { color: #c00000; }

.rd-form-comment { height: 110px; vertical-align: top; font-size: 11px; font-weight: 700; }
.rd-form-hl   { background: #ffff00; }
.rd-form-blue { color: #0070c0; text-decoration: underline; }
.rd-form-lines { margin-top: 8px; }
.rd-form-lines span { display: block; border-bottom: 1px dotted #999; height: 20px; }

@media print {
    .rd-form { page-break-after: always; }
    .rd-form-tbl { page-break-inside: avoid; }
}

@page { size: A4 portrait; margin: 12mm; }
`;
