import { Injectable } from '@angular/core';
import { Hero } from "./hero";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  constructor(private http: HttpClient) { }

  getAllHeroes() {
    return this.http.get<Hero[]>(`/assets/result.json`).pipe(map(result => {
      return result;
    }));
  }

}
