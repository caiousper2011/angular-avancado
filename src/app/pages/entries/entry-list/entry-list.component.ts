import { Entry } from './../shared/models/entry.model';
import { EntryService } from './../shared/services/entry.service';
import { Component } from '@angular/core';
import { BaseResourceList } from 'src/app/shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
})
export class EntryListComponent extends BaseResourceList<Entry> {
  constructor(protected entryService: EntryService) {
    super(entryService);
  }
}
