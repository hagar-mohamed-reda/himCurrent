import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user-profile/user-profile.service';

@Component({
  selector: 'app-control-and-results',
  templateUrl: './control-and-results.component.html',
  styleUrls: ['./control-and-results.component.scss']
})
export class ControlAndResultsComponent implements OnInit {

  constructor(private service:UserProfileService) { }
user:any={}
  ngOnInit() {
    this.loadProfile()
  }
  loadProfile() {
    this.service.getProfile().subscribe((res: any) => {
      debugger
       this.user = res.user;
     });
  }

}
