import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css', '../../../global.css'],
    imports: [NavbarComponent, FooterComponent, PageTitleComponent, CommonModule]
})
export class AboutComponent {

    clicked: number = 0;
    easterEgg: boolean = false;
    audio = new Audio('/browser/assets/easter/mp3');
    
    plusCount() {
        this.clicked++;
        if (this.clicked == 10) {
            this.doEasterEgg();
            this.clicked = 0;
        }
    }

    doEasterEgg() {

        if(this.easterEgg) {
            this.stopAudio();
            this.easterEgg = false;
            return;
        }
        this.audio.play();
        this.easterEgg = true;
    }

    ngOnDestroy() {
        this.stopAudio();
    }

    stopAudio() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

}
