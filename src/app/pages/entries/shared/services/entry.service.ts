import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Entry } from '../models/entry.model';
@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private apiPath: string = `${environment.apiUrl}/entries`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Entry[]> {
    return this.http
      .get<Entry[]>(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get<Entry>(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  create(category: Entry): Observable<Entry> {
    return this.http
      .post<Entry>(this.apiPath, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  update(category: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(error);
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach((item) => {
      const entry = Object.assign(new Entry(), item);
      entries.push(entry);
    });

    return entries;
  }
}
