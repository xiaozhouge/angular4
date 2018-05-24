import { Component, OnInit ,ViewChild} from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import {ReportService} from './services/report.service'
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router, NavigationStart ,RoutesRecognized ,NavigationCancel} from '@angular/router';
import { flyIn } from '../animations/fly-in';
import {routerTransition} from '../animations/routetransition'
import { slideToRight } from '../animations/slide-to-right';
@Component({
  selector: 'app-report',
  templateUrl: `./report.component.html`
  ,
  styleUrls: ['./report.component.less'],
  providers:[ReportService],
  animations: [
    flyIn,
    slideToRight,
    routerTransition
  ]
})
export class ReportComponent implements OnInit {
  constructor(
      public reportService : ReportService,
      private _message: NzMessageService,
      private route: ActivatedRoute,
      private router: Router,
    ) { 
    
  }
  public tourl:string; //用来记录跳转失败的UrL
  public orgID:string;
  public docID:string;
  public year:string;
  public loading=false;
  public _link="http://filings.ica.int.thomsonreuters.com/filings.viewer/Download.aspx?ApplicationId=TRF&contentformat=pdf&DocumentId=";
  public canleave:boolean;
  //用来记录update是否更新的变量
  public setdata_doc_name:string;
  public setdata_doc_id:string;
  public setdata_filing_year:string;
  public setdata_filing_date:string;
  public setdata_doc_link:string;
  public setdata_dcn:string;
  public setdata_source_type:string;
  public setdata_i:string;
  public reportslist:any;
  public doclist:any;//model数据
  //路由守卫
  canDeactivate(): Observable<boolean> | boolean {
    this.tx_showModal();
    this.router.events.subscribe(event => {
          if (event instanceof NavigationCancel) {
            this.tourl=event.url;
          }
     });
    if(this.canleave){
      return true;
    }
    return false ;
  }
  //提示信息
  createMessage = (type, text) => {
    this._message.create(type, `${text}`);
  };
  //list_modal
  list_isVisible = false;

  list_showModal = () => {
    this.list_isVisible = true;
  };

  list_handleOk = (e) => {
    setTimeout(
      () => {
      this.list_isVisible = false;
      this.reportService.postSubmitDoc(this.doclist).subscribe(
        res=>{
          if (res) {
            this.createMessage('success','submit success');
            this.reportslist=[];
            this.checkOptionsOne=[];
            this.allChecked=false;
            this.updateAllChecked();
            this.docID='';
            this.orgID='';
          }
        },
        error => {console.log(error);
              this.createMessage('warning','submit fail')},
        () => {}
      );
    }
    , 0);
  };

  list_handleCancel = (e) => {
    this.list_isVisible = false;
  };
  //tx_modal
  tx_isVisible = false;

  tx_showModal = () => {
    this.tx_isVisible = true;
  };
  tx_handleOk = (e) => {
    this.canleave=true;
    setTimeout(
      () => {
      this.tx_isVisible = false;
      this.router.navigate([this.tourl], { relativeTo: this.route });
    }
    , 0);
  };
  tx_handleCancel = (e) => {
    this.tx_isVisible = false;
    this.canleave=false;
  };
  //MODAL
  isVisible = false;
  showModal = (i) => {
    this.isVisible = true;
    this.setdata_i=i;
    this.setdata_doc_name=this.reportslist[this.setdata_i].doc_name;
    this.setdata_doc_id=this.reportslist[this.setdata_i].doc_id;
    this.setdata_filing_year=this.reportslist[this.setdata_i].filing_year;
    this.setdata_filing_date=this.reportslist[this.setdata_i].filing_date;
    this.setdata_doc_link=this.reportslist[this.setdata_i].doc_link;
    this.setdata_dcn=this.reportslist[this.setdata_i].dcn;
    this.setdata_source_type=this.reportslist[this.setdata_i].source_type;
  };
  handleOk = (e) => {
    this.reportslist[this.setdata_i].doc_name=this.setdata_doc_name;
    this.reportslist[this.setdata_i].doc_id=this.setdata_doc_id;
    this.reportslist[this.setdata_i].filing_year=this.setdata_filing_year;
    this.reportslist[this.setdata_i].filing_date=this.setdata_filing_date;
    this.reportslist[this.setdata_i].doc_link=this.setdata_doc_link;
    this.reportslist[this.setdata_i].dcn=this.setdata_dcn;
    this.reportslist[this.setdata_i].source_type=this.setdata_source_type;
    setTimeout(() => {
      this.isVisible = false;
    }, 0);
  };
  //选择框
  handleCancel = (e) => {
    this.isVisible = false;
  };
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
  public queryreport():void {
    if (!this.orgID) {
      this.createMessage('warning','Please enter orgID');
      return ;
    }
    if (!this.year) {
      this.createMessage('warning','Please choose year');
      return ;
    }
    if (this.year&&this.orgID) {
      this.loading=true;
      this.reportService.getReportList(this.orgID.trim(),this.year.trim()).subscribe(
        res=>{
          this.loading=false;
          this.reportslist=res;
          if(this.reportslist.length==0){
            this.reportslist=[];
            this.checkOptionsOne=[];
            this.createMessage('warning','Data does not exist')
            return;
          }
          this.checkOptionsOne=[];
          this.reportslist.forEach((item,i)=>{
            this.checkOptionsOne.push(
              { label:'', value:item.doc_id, checked: false })
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
     
  }
  public addnew():void {  
        if (this.docID) {
          this.loading=true;
          if (!(/^[0-9]*$/.test(this.docID))) {
            this.loading=false;
            this.createMessage('warning','It must be all the numbers')
            return;
          }
          if (this.reportslist){
            let single=true;
            //判断列表里已经有的docid不能去查
            this.reportslist.forEach((item,i)=>{
              if(this.docID==item.doc_id){
                this.loading=false;
                this.createMessage('warning','This document has already existed in the list')
                return single=false;
              }
            })
            if(single){
                this.reportService.getAddNew(this.docID).subscribe(
                  res=>{
                    this.loading=false;
                    if(!res){
                      this.createMessage('warning','Data does not exist')
                      return;
                    }
                    this.reportslist.push(res);
                    this.checkOptionsOne.push(
                      { label:'', value:res.doc_id, checked: false })
                  },
                  error => {console.log(error)},
                  () => {this.loading=false;}
                );
            }
            
          }else{
            this.reportService.getAddNew(this.docID).subscribe(
              res=>{
                this.loading=false;
                if(!res){
                  this.createMessage('warning','Data does not exist')
                  return;
                }
                let arr=[];
                arr.push(res);
                if(arr.length==0){
                  this.createMessage('warning','Data does not exist')
                  return;
                }
                this.checkOptionsOne.push(
                  { label:res.doc_id, value:res.doc_id, checked: false })
                this.reportslist=arr;
              },
              error => {console.log(error)},
              () => {this.loading=false;}
            );
          }
            
        }else{
          this.createMessage('warning','Please enter DocId')
        }   
    
  }
  public submitDoc():void {
    this.canleave=true;
    let data=[];
    this.checkOptionsOne.forEach((item,i)=>{
      if(item.checked){
        data.push(this.reportslist[i]);
      }
    })
    if (data.length==0) {
      return;
    }
    if (!this.year) {
       this.createMessage('warning','Please choose year');
       return ;
    }
    data.forEach((item,i)=>{
      item.query_year=this.year;
    }) 
    this.doclist=data;
    this.list_isVisible=true;
  }
 
  ngOnInit() { 
  }
  ngOnDestroy(){
  }
  
}
