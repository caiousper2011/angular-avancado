import { environment } from './../../../environments/environment';
import { BaseResourceModel } from '../models/base-resource.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> {
  protected http: HttpClient;
  protected apiPath: string = environment.apiUrl;

  constructor(
    protected pagePath: string,
    protected injector: Injector,
    protected jsonDataToResouceFn: (jsonData: any) => T
  ) {
    this.http = this.injector.get(HttpClient);
    this.apiPath += pagePath;
  }

  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(this.apiPath)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http
      .get<T>(url)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      );
  }

  create(resource: T): Observable<T> {
    return this.http
      .post<T>(this.apiPath, resource)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  protected handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(error);
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResouceFn(jsonData);
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach((item) => resources.push(this.jsonDataToResouceFn(item)));
    return resources;
  }
}
