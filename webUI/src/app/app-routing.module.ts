import { NgModule } from '@angular/core';
import { RouterModule, Routes,CanDeactivate } from '@angular/router';
import { Injectable }    from '@angular/core';
import { Observable }    from 'rxjs';

import { HelloComponent } from './hello/hello.component';
import { AccountComponent } from './account/account.component';
import { ReportComponent } from './report/report.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { RequestmanagementComponent } from './requestmanagement/requestmanagement.component';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
};

const routes: Routes = [
  {
    path: '',
    component: RequestmanagementComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  {
    path: 'candidates/:id',
    component: CandidatesComponent,
  },
  { path: 'account', component: AccountComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule],
  providers: [
     CanDeactivateGuard
  ]
})
export class AppRoutingModule { }
