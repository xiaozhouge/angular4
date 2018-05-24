import { Component ,ElementRef, Renderer,} from '@angular/core';
import {routerTransition} from './animations/routetransition'
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers:[],
  animations:[ routerTransition ]
})
export class AppComponent {
    routerState:boolean = true;
    routerStateCode:string = 'active';
    public name:string;
    constructor(private router:Router,
                public renderer: Renderer,
                public elementRef: ElementRef,
     ){
        // console.log(document.body.setAttribute('user',"{{name}}"))
        this.name=document.body.getAttribute('user');
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
          // 每次路由跳转改变状态
          this.routerState = !this.routerState;
          this.routerStateCode = this.routerState ? 'active' : 'inactive';
          }
        });
    }
}
