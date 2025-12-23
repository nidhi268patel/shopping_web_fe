import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private q$ = new BehaviorSubject<string>('');
  setQuery(q: string) { this.q$.next(q || ''); }
  observe(): Observable<string> { return this.q$.asObservable(); }
}
