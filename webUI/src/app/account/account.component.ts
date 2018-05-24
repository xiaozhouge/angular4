import { Component, OnInit } from '@angular/core';
import {routerTransition} from '../animations/routetransition'
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less'],
  animations:[ routerTransition ]
})
export class AccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
