import { Component, OnInit, Input } from '@angular/core';

interface IBreadCrumbItem {
  text: string;
  link?: string;
}

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css'],
})
export class BreadCrumbComponent implements OnInit {
  @Input() public items: IBreadCrumbItem[] = [];
  constructor() {}

  ngOnInit(): void {}

  isTheLastItem(item: IBreadCrumbItem): boolean {
    const index = this.items.indexOf(item);
    return index + 1 == this.items.length;
  }
}
