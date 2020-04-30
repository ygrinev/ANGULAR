import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap, map, switchMap, pluck } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface IArticle {
  title: string;
  url: string;
  source: {
    name: string;
  }
}

export interface INewsApiResponse {
  totalResults: number;
  articles: IArticle[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = 'ec1e3581b23f43559f4ef76ee6b25cf6';
  private country = 'ca';

  pagesInput: Subject<number> = new Subject();
  pagesOutput: Observable<IArticle[]>;
  numberOfPages: Subject<number> = new Subject();

  constructor(private http: HttpClient) { 
    this.pagesOutput = this.pagesInput.pipe(
      map((page) => {
        return new HttpParams()
        .set('apiKey', this.apiKey)
        .set('country', this.country)
        .set('pageSize', this.pageSize.toString())
        .set('page', page?.toString()??'0');
      }),
      switchMap((params) => {
        return this.http.get<INewsApiResponse>(this.url, {params});
      }),
      tap(response => {
        const totalPages = Math.ceil(response.totalResults/this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    );
  }

  getPage(page: number) {this.pagesInput.next(page);}
}
