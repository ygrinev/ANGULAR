import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { map, filter } from 'rxjs/operators';

@Directive({
  selector: '[appAnswerHighlight]'
})
export class AnswerHighlightDirective {

  constructor(private el: ElementRef, private controlName: NgControl) { 
    //console.log(controlName);
  }

  ngOnInit() {
    this.controlName.control.parent.valueChanges
      .pipe(map(({a,b,answer}) => Math.abs((a+b-answer)/(a+b)))
          //,filter(value => value <= 0.2)
      )
      .subscribe((value) => {
        if(value <= 0.2){
          this.el.nativeElement.classList.add(value == 0 ? 'bingos' : 'close');
        }
        else{
          this.el.nativeElement.classList.remove('close');
          this.el.nativeElement.classList.remove('bingos');
        }
      });
  }

}
