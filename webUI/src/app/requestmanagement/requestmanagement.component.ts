import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import {RequestmanagementService} from './services/requestmanagement.service'
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { flyIn } from '../animations/fly-in';
import {routerTransition} from '../animations/routetransition'
@Component({
  selector: 'app-requestmanagement',
  templateUrl: './requestmanagement.component.html',
  styleUrls: ['./requestmanagement.component.less'],
  providers:[RequestmanagementService],
  animations: [
    flyIn,
    routerTransition
  ]
})
export class RequestmanagementComponent implements OnInit {
  constructor(
      public RequestmanagementService : RequestmanagementService,
      private _message: NzMessageService,
      private route: ActivatedRoute,
      private router: Router,
    ) { 
    
  }
  createMessage = (type, text) => {
    this._message.create(type, `${text}`);
  };
  public loading=false;
  public status='All';
  public reportslist:any;
  public doclist:any;
  //MODAL
  tx_isVisible = false;

  tx_showModal = () => {
    this.tx_isVisible = true;
  };

  tx_handleOk = (e) => {
    setTimeout(
      () => {
      this.tx_isVisible = false;
    }
    , 0);
  };

  tx_handleCancel = (e) => {
    this.tx_isVisible = false;
  };
  //选择框
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [
    // { label: 'Apple', value: 'Apple', checked: false },
    // { label: 'Pear', value: 'Pear', checked: false },
    // { label: 'Orange', value: 'Orange', checked: false },
  ];
  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => item.checked = true);
    } else {
      this.checkOptionsOne.forEach(item => item.checked = false);
    }
  }
  updateSingleChecked() {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  //日历
  public _startDate = null;
  public _endDate = null;
  newArray = (len) => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  };
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  };
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  };
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() >= this._endDate.getTime();
  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() <= this._startDate.getTime();
  };
  get _isSameDay() {
    return this._startDate && this._endDate && moment(this._startDate).isSame(this._endDate, 'day')
  }
  get _endTime() {
    return {
      nzHideDisabledOptions: true,
      nzDisabledHours: () => {
        return this._isSameDay ? this.newArray(this._startDate.getHours()) : [];
      },
      nzDisabledMinutes: (h) => {
        if (this._isSameDay && h === this._startDate.getHours()) {
          return this.newArray(this._startDate.getMinutes());
        }
        return [];
      },
      nzDisabledSeconds: (h, m) => {
        if (this._isSameDay && h === this._startDate.getHours() && m === this._startDate.getMinutes()) {
          return this.newArray(this._startDate.getSeconds());
        }
        return [];
      }
    }
  }
  //自己的接口
  public queryreport():void {
    if (this._startDate==null) {
      this.createMessage('warning','Please choose the start time')
      return;
    }
    if (this._endDate==null) {
      this.createMessage('warning','Please choose the end time')
      return;
    }
    let styy=this._startDate.getFullYear();
    let stmm=this._startDate.getMonth()+1;
    let stdd=this._startDate.getDate();
    let enyy=this._endDate.getFullYear();
    let enmm=this._endDate.getMonth()+1;
    let endd=this._endDate.getDate();

    let stdata=styy+'-'+stmm+'-'+stdd;
    let endata=enyy+'-'+enmm+'-'+endd;
    this.RequestmanagementService.queryreq(stdata,endata).subscribe(
      res=>{
        this.loading=false;
        this.reportslist=res;
        if(this.reportslist.length==0){
          this.checkOptionsOne=[];
          this.reportslist=[];
          this.createMessage('warning','Data does not exist')
          return;
        }
        if (this.status=='all') {
        }else{
          this.reportslist=this.reportslist.filter((item)=>{
            return item.status==this.status;
          })
        }
        
        this.checkOptionsOne=[];
        this.reportslist.forEach((item,i)=>{
        this.checkOptionsOne.push(
           { label:'', value:item.id, checked: false })
         })
        this.createMessage('success','success')
      },
      error => {console.log(error);
        this.loading=false;
        this.createMessage('warning','fail')
      },
      () => {}
    );
    
  }
  //查看已经提交了哪些
  public lookdoclist(requestid):void {
    this.RequestmanagementService.queryreqdoc(requestid).subscribe(
      res=>{
          this.doclist=res;
          if (this.doclist.length==0) {
            this.createMessage('warning','You have not submitted any data');
            return;
          }
          this.tx_isVisible=true;
      },
      error => {console.log(error);
        
      },
      () => {}
    );
  }
  //跳转candidates之前验证是否是一个selected
  public gocandidates():void{
    if (this.reportslist.length==0) {
      this.createMessage('warning','You have not yet chosen any data');
      return;
    }
    let count=-1;
    let _gen:number;
    this.checkOptionsOne.forEach((item,i)=>{
      if(item.checked){
        _gen=i;
        count++;
      }
    })
    // t'generated',this.reportslist[_gen].id)
    if (count!=0||this.reportslist[_gen].status=='open') {
      this.createMessage('warning','You must choose one to open it and the status must   be not open');
      return;
    }
    this.router.navigate(['candidates',this.reportslist[_gen].id], { relativeTo: this.route });
  }
  public init():void{
    this.status='all';
    this._endDate=new Date();
    this._startDate=new Date(Date.now() - 3600 * 24 * 7 * 1000);
    this.queryreport();
  }
  ngOnInit() {
     this.init();
  }
  
}


