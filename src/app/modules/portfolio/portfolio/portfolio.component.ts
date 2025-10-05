import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioService } from '../services/portfolio.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { AlertService } from '@app/shared/services/alert.service';
import { Profile } from '@app/home/interfaces/profile';
import { Education } from '@app/home/interfaces/education';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  standalone: false
})
export class PortfolioComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private portfolioService = inject(PortfolioService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  profile: Profile = {
    name: 'KEVIN',
    last_name: 'GALARZA',
    title: 'SOFTWARE ENGINEER',
    cv: '',
    image: '/images/profile.jpg'
  };

  educationList: Education[] = [];

  ngOnInit(): void {
    this.getInformation();
  }

  ngOnDestroy(): void {
    this.destroy$?.next();
    this.destroy$?.complete();
    this.spinner.hide();
  }

  getInformation(): void {
    this.spinner.show();
    forkJoin([this.portfolioService.getProfile(), this.portfolioService.getEducation()]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([portResult, educResult]) => {
        if (portResult.status) {
          this.profile = portResult.data;
        }
        if (educResult.status) {
          this.educationList = educResult.data;
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

}
