import { CategoryService } from './../../../categories/shared/category.service';
import { Injectable, Injector } from '@angular/core';
import { Entry } from '../models/entry.model';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { flatMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { runInThisContext } from 'vm';
@Injectable({
  providedIn: 'root',
})
export class EntryService extends BaseResourceService<Entry> {
  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ) {
    super('/entries', injector, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  private setCategoryAndSendToServer(
    entry: Entry,
    sendFn: any
  ): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap((category) => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }
}
