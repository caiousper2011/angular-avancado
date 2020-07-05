import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css'],
})
export class PageHeaderComponent implements OnInit {
  @Input('page-title') public pageTitle: string;
  @Input('button-class') public buttonClass: string;
  @Input('button-text') public buttonText: string;
  @Input('button-link') public buttonLink: string;
  @Input('show-button') public showButton: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
