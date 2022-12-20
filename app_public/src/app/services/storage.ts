//Hook into localStorage via a factory service
// this will be injected into components that require access to localStorage

import { InjectionToken } from '@angular/core';

export const BROWSER_LOCAL_STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => localStorage

});

export const BROWSER_SESSION_STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => sessionStorage

});