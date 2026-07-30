import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevealOnScrollDirective } from '@features/portfolio/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-reveal-host',
  imports: [RevealOnScrollDirective],
  template: '<section appRevealOnScroll>Portfolio section</section>',
})
class RevealHostComponent {}

describe('RevealOnScrollDirective', () => {
  let fixture: ComponentFixture<RevealHostComponent>;
  let intersectionCallback: IntersectionObserverCallback;
  let observerInstance: IntersectionObserver;

  const mediaQuery = (matches: boolean): MediaQueryList =>
    ({
      matches,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as MediaQueryList;

  beforeEach(async () => {
    observerInstance = {
      root: null,
      rootMargin: '0px',
      scrollMargin: '0px',
      thresholds: [0.12],
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: vi.fn().mockReturnValue([]),
    };
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
        return observerInstance;
      }),
    );
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQuery(false)));

    await TestBed.configureTestingModule({
      imports: [RevealHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevealHostComponent);
  });

  afterEach(() => {
    fixture.destroy();
    vi.unstubAllGlobals();
  });

  it('reveals the element the first time it enters the viewport', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(element.classList.contains('portfolio-reveal')).toBe(true);
    expect(element.classList.contains('is-reveal-pending')).toBe(true);
    expect(observerInstance.observe).toHaveBeenCalledWith(element);

    intersectionCallback(
      [{ isIntersecting: true, target: element } as unknown as IntersectionObserverEntry],
      observerInstance,
    );

    expect(element.classList.contains('is-revealed')).toBe(true);
    expect(observerInstance.unobserve).toHaveBeenCalledWith(element);
  });

  it('keeps content visible when reduced motion is enabled', () => {
    vi.mocked(window.matchMedia).mockReturnValue(mediaQuery(true));

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(element.classList.contains('is-revealed')).toBe(true);
    expect(element.classList.contains('is-reveal-pending')).toBe(false);
  });
});
