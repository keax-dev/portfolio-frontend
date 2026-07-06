/**
 * Pruebas unitarias de las interacciones visuales del portafolio y el panel administrativo.
 */
import { ProjectCarouselComponent } from './technology/project-carousel/project-carousel.component';
import { ProjectDetailsComponent } from './technology/project-details/project-details.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CvPreviewComponent } from './header/cv-preview/cv-preview.component';
import { ShowImageComponent } from './technology/show-image/show-image.component';
import { ParameterService } from '@core/services/parameter.service';
import { TranslateService } from '@core/services/translate.service';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SessionService } from '@core/services/session.service';
import { HomeComponent } from '@features/admin/pages/home/home.component';
import { provideRouter } from '@angular/router';
import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Profile } from '@shared/interfaces/profile';
import { Project } from '@shared/interfaces/project';

describe('portfolio interaction components', () => {
  const profile: Profile = {
    name: 'Kevin',
    last_name: 'Galarza',
    title: 'Engineer',
    title_es: 'Ingeniero',
    cv: 'https://example.com/cv.pdf',
  };
  const project: Project = {
    id: 1,
    title: 'Portfolio',
    title_es: 'Portafolio',
    description: 'Description',
    description_es: 'Descripción',
    picture: 'project.png',
    position: 1,
    technology: 2,
  };

  // Caso: alterna la barra de navegación, cambia el idioma y emite contacto.
  it('toggles the navbar, changes language and emits contact', async () => {
    const translate = { setLang: '', getLang: 'es' };
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [{ provide: TranslateService, useValue: translate }],
    }).compileComponents();
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentRef.setInput('profile', profile);
    const component = fixture.componentInstance;
    const contact = vi.fn();
    component.contact.subscribe(contact);

    component.toggleNavbar();
    expect(component.navbarExpanded).toBe(true);
    component.selectLanguage('En');
    expect(translate.setLang).toBe('en');
    expect(component.navbarExpanded).toBe(false);

    component.toggleNavbar();
    component.contactEmit();
    expect(contact).toHaveBeenCalledOnce();
    expect(component.navbarExpanded).toBe(false);
  });

  // Caso: deriva la clase del encabezado y abre solo CVs configurados.
  it('derives the header class and opens only configured CVs', async () => {
    const translate = { getLang: 'es' };
    const parameter = { openDialog: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: TranslateService, useValue: translate },
        { provide: ParameterService, useValue: parameter },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentRef.setInput('profile', profile);
    const component = fixture.componentInstance;

    expect(component.classTitle).toBe('machine-2-es');
    component.openCvPreview();
    expect(parameter.openDialog).toHaveBeenCalledWith(
      CvPreviewComponent,
      { url: profile.cv },
      '92%',
      '98%',
    );

    fixture.componentRef.setInput('profile', { ...profile, cv: '' });
    component.openCvPreview();
    expect(parameter.openDialog).toHaveBeenCalledTimes(1);
  });

  // Caso: emite acciones de contacto desde el footer.
  it('emits footer contact actions', async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [TranslateService],
    }).compileComponents();
    const component = TestBed.createComponent(FooterComponent).componentInstance;
    const contact = vi.fn();
    component.contact.subscribe(contact);
    component.contactEmit();
    expect(contact).toHaveBeenCalledOnce();
    expect(component.year).toBe(new Date().getFullYear());
  });

  // Caso: construye identificadores del carrusel y abre diálogos de proyectos.
  it('builds carousel identifiers and opens project dialogs', async () => {
    const parameter = { openDialog: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ProjectCarouselComponent],
      providers: [
        { provide: TranslateService, useValue: { getLang: 'en' } },
        { provide: ParameterService, useValue: parameter },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProjectCarouselComponent);
    fixture.componentRef.setInput('technology', 7);
    const component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.carouselId).toBe('carouselProject7');

    fixture.componentRef.setInput('technology', 9);
    component.ngOnChanges({
      technology: new SimpleChange(7, 9, false),
    });
    expect(component.carouselId).toBe('carouselProject9');

    component.showProjectDetails(project);
    expect(parameter.openDialog).toHaveBeenCalledWith(
      ProjectDetailsComponent,
      project,
      '30%',
      '90%',
    );
    component.showImage(project);
    expect(parameter.openDialog).toHaveBeenCalledWith(
      ShowImageComponent,
      { url: 'project.png', alt: 'Portfolio' },
      '95%',
      '97.5%',
    );
  });

  // Caso: inicializa los detalles del proyecto, abre su imagen y cierra.
  it('initializes project details, opens its image and closes', async () => {
    const parameter = { openDialog: vi.fn() };
    const ref = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponent],
      providers: [
        { provide: TranslateService, useValue: { getLang: 'en' } },
        { provide: ParameterService, useValue: parameter },
        { provide: DIALOG_DATA, useValue: project },
        { provide: DialogRef, useValue: ref },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(ProjectDetailsComponent).componentInstance;
    component.ngOnInit();
    expect(component.project).toBe(project);
    component.showImage();
    expect(parameter.openDialog).toHaveBeenCalledWith(
      ShowImageComponent,
      { url: 'project.png', alt: 'Portfolio' },
      '95%',
      '97.5%',
    );
    component.close();
    expect(ref.close).toHaveBeenCalledOnce();
  });

  // Caso: inicializa y cierra un diálogo de imagen.
  it('initializes and closes an image dialog', async () => {
    const ref = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [ShowImageComponent],
      providers: [
        { provide: DIALOG_DATA, useValue: { url: 'image.png', alt: 'Preview' } },
        { provide: DialogRef, useValue: ref },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(ShowImageComponent).componentInstance;
    component.ngOnInit();
    expect(component.urlImg).toBe('image.png');
    expect(component.altImg).toBe('Preview');
    component.close();
    expect(ref.close).toHaveBeenCalledOnce();
  });

  // Caso: sanea previsualizaciones válidas de CV y cierra su diálogo.
  it('sanitizes valid CV previews and closes their dialog', async () => {
    const ref = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [CvPreviewComponent],
      providers: [
        { provide: DIALOG_DATA, useValue: { url: profile.cv } },
        { provide: DialogRef, useValue: ref },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(CvPreviewComponent).componentInstance;
    component.ngOnInit();
    expect(component.originalUrl).toBe(profile.cv);
    expect(component.previewUrl).not.toBeNull();
    component.close();
    expect(ref.close).toHaveBeenCalledOnce();
  });

  // Caso: delega el ciclo de vida administrativo y el logout en SessionService.
  it('delegates admin lifecycle and logout behavior to SessionService', async () => {
    const session = {
      ensureProtectedSession: vi.fn(),
      stopExpirationWatcher: vi.fn(),
      logOut: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), { provide: SessionService, useValue: session }],
    }).compileComponents();
    const component = TestBed.createComponent(HomeComponent).componentInstance;
    component.ngOnInit();
    component.logOut();
    component.ngOnDestroy();
    expect(session.ensureProtectedSession).toHaveBeenCalledOnce();
    expect(session.logOut).toHaveBeenCalledOnce();
    expect(session.stopExpirationWatcher).toHaveBeenCalledOnce();
    expect(component.menuList).toHaveLength(8);
  });
});
