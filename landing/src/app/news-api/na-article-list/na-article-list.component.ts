import { Component, OnInit } from '@angular/core';
import { NewsApiService, IArticle } from '../news-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css']
})
export class NaArticleListComponent implements OnInit {

  articles$: Observable<IArticle[]>;
  articles: IArticle[];

  constructor(private newsApiService: NewsApiService) { 
    this.newsApiService.pagesOutput.subscribe((articles) => {
      this.articles = articles;
      //console.log(articles[0]);
    });

    this.newsApiService.getPage(1);
  }

  ngOnInit(): void {
  }

}
