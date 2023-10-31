import { Injectable, OnInit } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnInit {

    ngOnInit(): void {

    }

    constructor() {

    }

    public checkDarkMode(): boolean {
        let darkMode = false;
        if (localStorage.getItem('dark-mode')) {
            darkMode = localStorage.getItem('dark-mode') == 'true' ? true : false;
            return darkMode;
        } else {
            localStorage.setItem('dark-mode', 'false');
            return darkMode;
        }
    }

}