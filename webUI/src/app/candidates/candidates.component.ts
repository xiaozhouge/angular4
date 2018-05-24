import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { flyIn } from '../animations/fly-in';
import {routerTransition} from '../animations/routetransition'
import {CandidatesService} from './services/candidates.service'
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.less'],
  providers:[CandidatesService],
  animations: [
    flyIn,
    routerTransition
  ],
})
export class CandidatesComponent implements OnInit {

  constructor(
    public candidatesService : CandidatesService,
    private route: ActivatedRoute,
    private router: Router,
    private _message: NzMessageService,
    ) { 
      
  }
  createMessage = (type, text) => {
    this._message.create(type, `${text}`);
  };
  public _link="http://filings.ica.int.thomsonreuters.com/filings.viewer/Download.aspx?ApplicationId=TRF&contentformat=pdf&DocumentId=";
  public frameU='';
  public source_data:any;//源数据
  public doclist:any;//modal data
  public checknum=-1; 
  public statu:string;
  public textClicked:number; //select li
  public route_id:number;
  public donelist:any; //状态为done的DP
  public mockLoading:boolean=false;//iframe的遮罩层
  tabss_len=0;
  tabs = [
    {
      index: 1,
      title:'Existed DP'
    },
    {
      index: 2,
      title:'New DP'
    }
  ];
  tabss =[];
  public finding_str:string;
  public finding_docid:string;
  //heightLightWord iframe
  public heightLightWord(word,docid,page):void{
    this.mockLoading=true;
    this.frameU=new Date().toString();
    if (!docid||!word) {
      this.tx_isVisible=true;
      this.checkOptionsOne=[];
      this.lookdoclist(this.route_id);
      return;
    }
    if(word.indexOf('\n')>-1){
        word=word.split('\n')[1];
    }
    this.finding_str=word;
    this.finding_docid=docid;
    sessionStorage.setItem('page',page);
    sessionStorage.removeItem('word');
    setTimeout(()=>{
      this.frameU='';
      this.frameU+=window.location.origin+"/static/pdfbuild/web/viewer.html?file=";
      this.frameU+=window.location.origin+"/showpdf/"+docid;
    },150)
  }
  //table
  _fixHeader = true;
  _allChecked = false;
  _indeterminate = false;
  _displayData = [];
  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }
  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }
  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        data.checked = true;
      });
    } else {
      this._displayData.forEach(data => {
        data.checked = false;
      });
    }
    this._refreshStatus();
  }
  public category:any;//全部的分类
  public categorysel:string='All';//分类选择的哪个
  public source_data_exist:any;//existDP
  public source_data_new:any;//new DP
  public SelectedTabset:number;//existDP和new DP的tab切换
  //上个页面传过来的request_id
  public query_candidatesel():void {
    this.candidatesService.candidatesel(this.route_id).subscribe(
      res=>{
          this.source_data=res;
          let arr=[];
          this.source_data_exist=[];
          this.source_data_new=[];
          this.source_data.dp_list.forEach((item,i)=>{
            arr.push(item.category);
            if (item.exist_last_year) {
              this.source_data_exist.push(item)
            }else{
              this.source_data_new.push(item)
            }
          })
          if (this.source_data_exist>0) {
            this.changcandidate(this.source_data_exist[0].id,this.source_data_exist[0].status,0);
          }else{
            this.SelectedTabset=2;
            this.changcandidate(this.source_data_new[0].id,this.source_data_new[0].status,0);
          }
          
          this.category=Array.from(new Set(arr));
      },
      error => {console.log(error);
        
      },
      () => {}
    );
  }
  public selectTab:number;//此DP里最高分的candidate
  //点击上面的tr列表，列出对应的candidates
  public changcandidate(dpid,statu,i):void{
    this.confirmshow=true;
    this.tabss=[];
    this.tabss_len=0;//tabss的原始长度
    this.checknum=-1;//newC查看list选择的个数
    this.statu=statu;//dp的状态
    this.textClicked=i;//识别哪个list被点击了
    this.source_data.candidate.forEach((item,i)=>{
      item.link=this.source_data.meta_datas[item.doc_id].link;
      item.title=this.source_data.meta_datas[item.doc_id].title;
        if (item.dp_id==dpid) {
          this.tabss.push(item)
        }
      })
      this.tabss_len=this.tabss.length;
      this.tabss.push({
            "score":'',
            "doc_id":'',
            "id":'',
            "create_time":"",
            "selected":null,
            "fcc_value":"",
            "comment":null,
            "content":"",
            "dp_id":'',
            "request_id":'',
            "update_time":"",
            "manual":null,
            "scope":null,
            "page_num":null,
            "title":'',
            "link":''

      })
      this.selectTab=-1;
      this.tabss.forEach((item,i)=>{
        if (item.selected) {
          this.selectTab=i;
        }
      })
      if (this.selectTab<0) {
        this.selectTab=0;
      }
      this.heightLightWord(this.tabss[this.selectTab].content,this.tabss[this.selectTab].doc_id,this.tabss[this.selectTab].page_num);
  }
  //MODAL
  tx_isVisible = false;
  tx_showModal = () => {
    this.tx_isVisible = true;
  };
  tx_handleOk = (e) => {
    setTimeout(
      () => {
       let count=0;
      this.checkOptionsOne.forEach((item,i)=>{
        if(item.checked){
          this.checknum=i;
          count++;
        }
      })
      if (count!=1) {
        this.createMessage('warning','You have to choose one to fill in the NewC');
        return;
      }
      this.tx_isVisible = false;
      this.tabss[this.tabss.length-1].title=this.checknum!=-1?this.doclist[this.checknum].doc_name:'';
      this.tabss[this.tabss.length-1].link=this.checknum!=-1?this.doclist[this.checknum].doc_link:'';
    }
    , 0);
  };

  tx_handleCancel = (e) => {
    this.tx_isVisible = false;
  };
  //___MODAL
  _isVisible = false;

  _showModal = () => {
    this._isVisible = true;
  };
  _handleOk = (e) => {
    setTimeout(
      () => {
      this._isVisible = false;
    }
    , 0);
  };
  _handleCancel = (e) => {
    this._isVisible = false;
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
  //查看已经提交了哪些
  public lookdoclist(requestid):void {
    this.candidatesService.queryreqdoc(requestid).subscribe(
      res=>{
          this.doclist=res;
          if (this.doclist.length==0) {
            this.createMessage('warning','You have not submitted any data');
            return;
          }
          this.tx_isVisible=true;
          this.doclist.forEach((item,i)=>{
            this.checkOptionsOne.push(
              { label:'', value:item.doc_id, checked: false })
          })
      },
      error => {console.log(error);
        
      },
      () => {}
    );
  }
  public confirmshow:boolean=true;//点击完confirm后隐藏此按钮
  public confirm(tab):void{
    if (!tab.comment&&!tab.fcc_value) {
      this.createMessage('warning','The comment and the fcc_value can\'t be empty');
      return;
    }
    this.source_data.dp_list[this.textClicked].comment=tab.comment;
    this.source_data.dp_list[this.textClicked].rating=tab.fcc_value;
    this.source_data.dp_list[this.textClicked].status='Done';
    this.candidatesService.postcandidatesel(tab).subscribe(
      res=>{
        if (res) {
          this.createMessage('success','success');
          this.confirmshow=false;
        }
      },
      error => {console.log(error);
        
      },
      () => {}
    );
  }
  public lookdonelist():void{
    this.donelist=[];
    this.source_data.dp_list.forEach((item,i)=>{
      this.source_data.candidate.forEach((citem,j)=>{
          if (item.status=='Done'&&item.id==citem.dp_id) {
                let obj={
                  fcc_code:'',
                  dp_desc:'',
                  reportName:'',
                  content:'',
                  rating:'',
                };
                obj.fcc_code=item.fcc_code;
                obj.dp_desc=item.dp_desc;
                obj.content=citem.content;
                obj.reportName=this.source_data.meta_datas[citem.doc_id].title;
                obj.rating=item.rating;
                this.donelist.push(obj);
          }
          
       })
    })
    if (this.donelist.length>0) {
      this._isVisible=true;
    }
  }
  public reopenDP():void{
    let selectItems=[];
    let data=[];
    let canreopen=0;
    this._displayData.forEach((item,i)=>{
      if (item.checked) {
        selectItems.push(item);
      }
    })
    selectItems.forEach((item,i)=>{
      if (item.status=='Todo') {
        canreopen++;
        return;
      }
      data.push(item.id)
    })
    if (canreopen==0) {
      let postData={
        "request_id": this.route_id,
        "dp_ids":data
      };
      this.candidatesService.resetcandidate(postData).subscribe(
        res=>{
          if (res) {
            this.createMessage('success','reopen success');
            this.query_candidatesel();
          }
        },
        error => {console.log(error);},
        () => {}
      );
    }else{
      this.createMessage('warning','An item with a state of todo can\'t be reopen');
    }
    
  }
  public init():void{
    this.route_id = Number(this.route.snapshot.paramMap.get('id'));
    this.query_candidatesel();
  }
  public matchstr(word):void{
    word=word.substr(1,word.lenth);
    sessionStorage.setItem('word',word);
    this.mockLoading=false;
    // window.frames[0].window.location.reload();
    window.frames[0].window.document.getElementById('findInput').value=word;
    window.frames[0].window.document.getElementById('findNext').click();
  }
  ngOnInit() {
    this.init();
    let that=this;
    window.addEventListener('message',function(rs){ 
            // localStorage.removeItem('pdfjs.history');
            console.log(rs.data);
            setTimeout(()=>{
              let layernum=parseInt(sessionStorage.getItem('page'))-1 ;
              let source_data=window.frames[0].window.document.getElementsByClassName("page")[layernum].children[1].innerText;
              //console.log(window.frames[0].window.document.getElementsByClassName("page")[layernum].children[1].innerHTML)
              let data={
                "source_data":source_data,
                "finding_str":that.finding_str
              };
              that.candidatesService.postnearmatch(data).subscribe(
                res=>{
                  if (res) {
                    that.createMessage('success','success');
                    that.matchstr(res);
                  }else{
                    that.createMessage('warning','I\'m sorry, it doesn\'t match any sentence.');
                    that.mockLoading=false;
                    return;
                  }
                },
                error => {console.log(error);
                  
                },
                () => {}
              );
            },500)       

      })
  }

}
