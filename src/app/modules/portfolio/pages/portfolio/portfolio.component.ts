import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { PortfolioService } from '@app/portfolio/services/portfolio.service';
import { ContactComponent } from '../contact/contact.component';
import { ParameterService } from '@app/shared/services/parameter.service';
import { SocialNetwork } from '@app/home/interfaces/social-network';
import { AlertService } from '@app/shared/services/alert.service';
import { Technology } from '@app/home/interfaces/technology';
import { Education } from '@app/home/interfaces/education';
import { MenuItem } from 'primeng/api';
import { Profile } from '@app/home/interfaces/profile';
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
  private parameter = inject(ParameterService);
  private spinner = inject(NgxSpinnerService);
  private alert = inject(AlertService);

  profile: Profile = {
    name: 'KEVIN',
    last_name: 'GALARZA',
    title: 'SOFTWARE ENGINEER',
    cv: '',
    image: './images/profile.jpg'
  };

  navItems: MenuItem[] = [
    { label: 'Home', routerLink: '#home' },
    { label: 'Education', routerLink: '#education' },
    { label: 'Skills', routerLink: '#skills' },
    { label: 'Portfolio', routerLink: '#portfolio' },
    { label: 'Contact', routerLink: '' },
    { label: 'Login', routerLink: '/login' },
  ];

  technologyList: Technology[] = [];
  educationList: Education[] = [];
  socialNetworkList: SocialNetwork[] = [];
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
    forkJoin([this.portfolioService.getProfile(), this.portfolioService.getEducation(), this.portfolioService.getSkill(), this.portfolioService.getTechnology(), this.portfolioService.getSocialNetwork()]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([portResult, educResult, skiResult, techResult, sociResult]) => {
        if (portResult.status) {
          this.profile = portResult.data;
        }
        if (educResult.status) {
          this.educationList = educResult.data.sort((a, b) => a.position - b.position);
        }
        if (skiResult.status) {
          this.skillList = skiResult.data.sort((a, b) => a.position - b.position);
        }
        if (techResult.status) {
          this.technologyList = techResult.data.map(technology => {
            technology.projects = technology.projects.sort((a, b) => a.position - b.position);
            return technology;
          }).sort((a, b) => a.position - b.position);
        }
        if (sociResult.status) {
          this.socialNetworkList = sociResult.data.sort((a, b) => a.position - b.position);
        }
      },
      complete: () => this.spinner.hide(),
      error: () => this.alert.applicationError()
    });
  }

  modalContact(): void {
    const dialogRef = this.parameter.openDialog(ContactComponent, null, '30%', '90%');
    dialogRef.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        const homeSection = document.getElementById('home');
        if (result && homeSection) homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

}
