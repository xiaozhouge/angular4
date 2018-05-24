import { Component, OnInit } from '@angular/core';
import {routerTransition} from '../animations/routetransition'
@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.less'],
  animations:[ routerTransition ]
})
export class HelloComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
