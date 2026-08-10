import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'src/app/shared/auth';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  $: any = $;

  constructor(private http: HttpClient) {
  }

  /**
   * get services from api
   *
   */
  public get(data) {
    return this.http.get('academic/report/get-result?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
  }

    /**
   * get services from api
   *
   */
      public getWithTermAndYear(data)
      {
      return this.http.get('academic/report/get-student-result?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }


      //START NEW API/////////////////////////////////////////////
      public getWithStatus(data)
      {
      return this.http.get('academic/report/get-student-status?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }
      //END NEW API/////////////////////////////////////////////

      /**
       * احصائيات نتائج العام الدراسي (لوحة المعلومات)
       */
      public getResultsStatistics(data)
      {
      return this.http.get('academic/report/results-statistics?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }


      public getWithTermAndYearStudents(data)
      {
      return this.http.get('academic/report/get-all_students-result?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }

      public GetAllStudentsResultLevel2(data)
      {
      return this.http.get('academic/report/get-all_students-result/level2?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }
      public GetAllStudentsResultLevel1level2(data)
      {
      return this.http.get('academic/report/get-all_students-result/level1/level2?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }
       public getAllStudentsResultLevel1andlevel2NewFromMomaher(data)
      {
        const headers = new HttpHeaders({
              'Content-Type': 'text/plain; charset=utf-8'
            });
      // return this.http.get();
      return this.http.get<string>('academic/report/getAllStudentsResultLevel1andlevel2NewFromMomaher?api_token=' + Auth.getApiToken()+"&"+this.$.param(data), { headers: headers, params: data, responseType: 'text' as 'json' });
  
    }
      public getAllStudentsResultLevel2(data)
      {
      return this.http.get('academic/report/get-all_students-result/level2?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }
      public gettotalPages(data)
      {
      return this.http.get('academic/report/get/totalPages?api_token=' + Auth.getApiToken()+"&"+this.$.param(data));
      }
      public getStudentsAge()
      {
      return this.http.get('academic/report/show/RecruitmentReport?api_token=' + Auth.getApiToken());
      }
      public UpdateStudentsAge()
      {
      return this.http.get('academic/report/update/RecruitmentReport?api_token=' + Auth.getApiToken());
      }
}
