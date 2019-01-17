import { ElementRef, OnDestroy, OnChanges, AfterViewInit, HostListener } from '@angular/core';
import { Directive } from '@angular/core';
import 'jquery-nice-select';

declare var $;

@Directive({
  selector: '[nice-select]',
})
export class NgNiceSelectDirective implements AfterViewInit, OnDestroy {

  observer: MutationObserver;

  constructor(
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    $(this.el.nativeElement).niceSelect();

    this.attachAngularChange();
    this.attachObserver();
  }

  attachAngularChange(): void {
    $(this.el.nativeElement).one('change', () => {
      const customEvent = document.createEvent('Event');
      customEvent.initEvent('change', true, true);
      this.el.nativeElement.dispatchEvent(customEvent);
      this.attachAngularChange();
    });
  }

  attachObserver() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(() => this.onChanges());
    });

    this.observer.observe(this.el.nativeElement, {
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  detachObserver() {
    this.observer.disconnect();
  }

  onChanges() {
    this.detachObserver();
    $(this.el.nativeElement).niceSelect('update');
    this.attachObserver();
  }

  ngOnDestroy() {
    this.detachObserver();
    $(this.el.nativeElement).niceSelect('destroy');
  }

}
