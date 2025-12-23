import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  getItem<T>(key: string): T | null {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) as T : null;
  }
  removeItem(key: string) { localStorage.removeItem(key); }
  clear() { localStorage.clear(); }
}
