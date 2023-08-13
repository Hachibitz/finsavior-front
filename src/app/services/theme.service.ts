import { Injectable, OnInit } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnInit {

    ngOnInit(): void {

    }

    constructor() {

    }

    public checkDarkMode(): boolean {
        let darkMode = false;
        if (sessionStorage.getItem('dark-mode')) {
            darkMode = sessionStorage.getItem('dark-mode') == 'true' ? true : false;
            return darkMode;
        } else {
            sessionStorage.setItem('dark-mode', 'false');
            return darkMode;
        }
    }

}