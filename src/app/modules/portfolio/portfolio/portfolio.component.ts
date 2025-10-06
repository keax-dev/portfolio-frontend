import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioService } from '../services/portfolio.service';
import { AlertService } from '@app/shared/services/alert.service';
import { Profile } from '@app/home/interfaces/profile';
import { Education } from '@app/home/interfaces/education';
import { Skill } from '@app/home/interfaces/skill';

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
    image: './images/profile.jpg'
  };

  educationList: Education[] = [];
  skillList: Skill[] = [];

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
    forkJoin([this.portfolioService.getProfile(), this.portfolioService.getEducation(), this.portfolioService.getSkill()]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([portResult, educResult, skiResult]) => {
        if (portResult.status) {
          this.profile = portResult.data;
        }
        if (educResult.status) {
          this.educationList = educResult.data.sort((a, b) => a.position - b.position);
        }
        if (skiResult.status) {
          this.skillList = skiResult.data.sort((a, b) => a.position - b.position);;
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

}
