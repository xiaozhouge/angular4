import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition',[
	  transition("void => *", [
	    style({ opacity: 0 }),
	    animate(2000, style({ opacity: 1 }))
	  ]),
	  transition("* => void", [
	    animate(600, style({ opacity: 0 }))
	  ])
])