import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ListOrdersHandlerComponent } from "../../components/list-orders-handler/list-orders-handler.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-list-orders',
    standalone: true,
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.css', '../../../global.css'],
    imports: [NavbarComponent, PageTitleComponent, FooterComponent, ListOrdersHandlerComponent, CommonModule]
})
export class ListOrdersComponent implements AfterViewInit, OnDestroy {

    @ViewChild('pageContent') container!: ElementRef<HTMLDivElement>;

    isTop: boolean = true;
    isBottom: boolean = false;

    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterViewInit() {
        if (this.container) {
            this.container.nativeElement.addEventListener('scroll', this.onContainerScroll.bind(this));
            this.updateScrollState();
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy() {
        if (this.container) {
            this.container.nativeElement.removeEventListener('scroll', this.onContainerScroll);
        }
    }

    onContainerScroll() {
        this.updateScrollState();
    }

    updateScrollState() {
        if (this.container) {
            const container = this.container.nativeElement;
            const scrollPosition = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            const wasTop = this.isTop;
            const wasBottom = this.isBottom;

            this.isTop = scrollPosition === 0;
            this.isBottom = (scrollPosition + clientHeight) >= scrollHeight;

            if (wasTop !== this.isTop || wasBottom !== this.isBottom) {
                this.cdr.detectChanges();
            }
        }
    }

    scrollUp() {
        if (this.container) {
            const container = this.container.nativeElement;
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    scrollDown() {
        if (this.container) {
            const container = this.container.nativeElement;
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }
}
