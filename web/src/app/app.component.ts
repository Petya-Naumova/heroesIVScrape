import {Component, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Hero} from "./hero";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web';
  heroes: Hero[] = []
  constructor(public http: HttpClient) {}
  ngOnInit() {
    this.http.get<Hero[]>('/assets/result.json').subscribe(data => {
      this.heroes = data;
    });
  }
}
