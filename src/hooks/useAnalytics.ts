import { useEffect, useCallback, useRef } from 'react';

// Analytics event types
type EventCategory = 'navigation' | 'interaction' | 'conversion' | 'error' | 'performance';

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// Performance metrics
interface WebVitals {
  CLS?: number;
  FID?: number;
  FCP?: number;
  LCP?: number;
  TTFB?: number;
}

// Analytics provider (mock implementation - replace with real service)
class AnalyticsService {
  private static instance: AnalyticsService;
  private queue: AnalyticsEvent[] = [];
  private isInitialized = false;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    // Process queued events
    this.queue.forEach(event => this.send(event));
    this.queue = [];
    
    // Track page views
    this.trackPageView();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    console.log('[Analytics] Initialized');
  }

  track(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      this.queue.push(event);
      return;
    }
    this.send(event);
  }

  private send(event: AnalyticsEvent) {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
    
    // Send to analytics service
    // Replace with your actual analytics implementation
    // e.g., gtag('event', event.action, { ... })
    // e.g., posthog.capture(event.action, { ... })
  }

  trackPageView(path?: string) {
    this.track({
      category: 'navigation',
      action: 'page_view',
      label: path || window.location.pathname,
      metadata: {
        referrer: document.referrer,
        title: document.title,
      },
    });
  }

  trackInteraction(element: string, action: string, metadata?: Record<string, any>) {
    this.track({
      category: 'interaction',
      action,
      label: element,
      metadata,
    });
  }

  trackConversion(type: string, value?: number, metadata?: Record<string, any>) {
    this.track({
      category: 'conversion',
      action: type,
      value,
      metadata,
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      category: 'error',
      action: 'error',
      label: error.message,
      metadata: {
        stack: error.stack,
        ...context,
      },
    });
  }

  trackPerformance(metrics: WebVitals) {
    this.track({
      category: 'performance',
      action: 'web_vitals',
      metadata: metrics,
    });
  }

  private setupPerformanceMonitoring() {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.trackPerformance({ LCP: lastEntry.startTime });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {}

      // FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.trackPerformance({ FID: entry.processingStart - entry.startTime });
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {}

      // CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.trackPerformance({ CLS: clsValue });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}
    }
  }
}

export const analytics = AnalyticsService.getInstance();

// React hooks for analytics
export const useAnalytics = () => {
  useEffect(() => {
    analytics.init();
  }, []);

  const trackClick = useCallback((element: string, metadata?: Record<string, any>) => {
    analytics.trackInteraction(element, 'click', metadata);
  }, []);

  const trackView = useCallback((section: string) => {
    analytics.trackInteraction(section, 'view');
  }, []);

  const trackConversion = useCallback((type: string, value?: number) => {
    analytics.trackConversion(type, value);
  }, []);

  return { trackClick, trackView, trackConversion };
};

// Track element visibility
export const useTrackVisibility = (elementId: string) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element || hasTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            analytics.trackInteraction(elementId, 'view');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId]);
};

// Track time on page
export const useTrackTimeOnPage = () => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    const handleUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      analytics.track({
        category: 'interaction',
        action: 'time_on_page',
        value: timeSpent,
        label: window.location.pathname,
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
};
