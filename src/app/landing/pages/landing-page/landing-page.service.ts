import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export interface HeroContent {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

export interface DetailsSection {
  heading: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface ContactFormPayload {
  nombre: string;
  institucion: string;
  email: string;
  mensaje: string;
}

@Injectable()
export class LandingPageService {
  private readonly document = inject(DOCUMENT);

  readonly title = signal('CobraloPe');
  readonly companyEmail = signal('info@famatconsulting.com');

  readonly hero = signal<HeroContent>({
    heading: 'Automatiza las cobranzas de tu institución educativa',
    description:
      'Optimiza la gestión de pagos, reduce la morosidad y mejora la experiencia de tus alumnos y responsables con una plataforma moderna y segura.',
    ctaLabel: 'Solicita una demo',
    ctaHref: '#contacto',
    backgroundImage:
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
  });

  readonly features = signal<FeatureCard[]>([
    {
      title: 'Recordatorios automáticos',
      description: 'Por SMS, WhatsApp y correo para reducir la morosidad.',
      linkLabel: 'Más detalles',
      linkHref: '#detalles',
    },
    {
      title: 'Panel de control',
      description: 'Reportes y métricas en tiempo real para tu gestión.',
      linkLabel: 'Más detalles',
      linkHref: '#detalles',
    },
    {
      title: 'Pagos online',
      description: 'Conciliación automática y múltiples métodos de pago.',
      linkLabel: 'Más detalles',
      linkHref: '#detalles',
    },
    {
      title: 'Múltiples roles y permisos',
      description:
        'Gestión segura y flexible para tu equipo administrativo.',
      linkLabel: 'Más detalles',
      linkHref: '#detalles',
    },
  ]);

  readonly details = signal<DetailsSection>({
    heading: '¿Por qué automatizar tus cobranzas?',
    bullets: [
      'Reduce la morosidad y mejora el flujo de caja.',
      'Minimiza tareas manuales y errores administrativos.',
      'Ofrece una mejor experiencia a padres y alumnos.',
      'Acceso a reportes y métricas en tiempo real.',
    ],
    ctaLabel: 'Solicita tu demo',
    ctaHref: '#contacto',
    imageSrc:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Automatización',
  });

  readonly process = signal<ProcessStep[]>([
    {
      stepNumber: 1,
      title: 'Configura tu institución',
      description: 'Carga alumnos, cronogramas y métodos de pago.',
    },
    {
      stepNumber: 2,
      title: 'Automatiza recordatorios',
      description: 'El sistema envía avisos y permite pagos online.',
    },
    {
      stepNumber: 3,
      title: 'Controla y reporta',
      description: 'Visualiza métricas, reportes y gestiona la cobranza.',
    },
  ]);

  readonly testimonials = signal<Testimonial[]>([
    {
      quote:
        'La plataforma nos ayudó a reducir la morosidad en un 40% en solo 3 meses.',
      author: 'María G., Administradora',
    },
    {
      quote:
        'Ahora los padres pueden pagar y recibir recordatorios fácilmente, ¡todo automatizado!',
      author: 'Carlos P., Director',
    },
  ]);

  readonly loading = signal(false);
  readonly sent = signal(false);

  submitContact(payload: ContactFormPayload) {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.sent.set(false);

    const subject = encodeURIComponent('Consulta desde landing');
    const body = encodeURIComponent(
      `Nombre: ${payload.nombre}\nInstitución: ${payload.institucion}\nCorreo: ${payload.email}\nMensaje: ${payload.mensaje}`
    );

    this.document.location.href = `mailto:${this.companyEmail()}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      this.loading.set(false);
      this.sent.set(true);
    }, 1000);
  }

  resetContactState() {
    this.loading.set(false);
    this.sent.set(false);
  }
}
