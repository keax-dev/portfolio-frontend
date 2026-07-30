import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DialogService } from '@core/services/dialog.service';
import { PortfolioComponent } from '@features/portfolio/pages/portfolio/portfolio.component';
import { PortfolioPageStore } from '@features/portfolio/services/portfolio-page.store';
import { Profile } from '@shared/interfaces/profile';
import { of } from 'rxjs';

describe('PortfolioComponent', () => {
  let fixture: ComponentFixture<PortfolioComponent>;
  let component: PortfolioComponent;
  let store: ReturnType<typeof pageStore>;
  let dialogs: { open: ReturnType<typeof vi.fn> };
  let router: { url: string; navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    store = pageStore();
    dialogs = { open: vi.fn().mockReturnValue({ afterClosed: () => of(false) }) };
    router = { url: '/projects', navigate: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [
        { provide: PortfolioPageStore, useValue: store },
        { provide: DialogService, useValue: dialogs },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
  });

  it('initializes the page store with the current route', () => {
    component.ngOnInit();

    expect(store.initialize).toHaveBeenCalledWith('/projects');
    expect(component.profile()).toEqual(store.profile());
    expect(component.skillList()).toEqual(store.skills());
  });

  it('stops the global loading indicator when the page is destroyed', () => {
    component.ngOnDestroy();
    expect(store.stopLoading).toHaveBeenCalledOnce();
  });

  it('returns home after completing the contact dialog', () => {
    dialogs.open.mockReturnValue({ afterClosed: () => of(true) });
    component.modalContact();
    expect(router.navigate).toHaveBeenCalledWith(['/'], { fragment: 'home' });
  });

  function pageStore() {
    const profile = signal<Profile>({
      name: 'Kevin',
      last_name: 'Galarza',
      title: 'Engineer',
      title_es: 'Ingeniero',
      cv: 'https://example.com/cv-en.pdf',
      cv_es: 'https://example.com/cv-es.pdf',
    });

    return {
      initialize: vi.fn(),
      stopLoading: vi.fn(),
      profile,
      education: signal([]),
      courses: signal([]),
      projects: signal([]),
      skills: signal([{ id: 1, name: 'Angular', position: 1 }]),
      socialNetworks: signal([]),
    };
  }
});
