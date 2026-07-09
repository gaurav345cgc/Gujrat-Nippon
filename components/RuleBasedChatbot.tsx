'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  ArrowDownToLine,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Headphones,
  MessageSquare,
  Package,
  Send,
  X,
} from 'lucide-react';
import Link from 'next/link';
import styles from './RuleBasedChatbot.module.css';
import {
  type ChatbotFaqPayload,
  type ChatbotViewKey,
  type ChatOption,
  mergeFaqsIntoCategoryOptions,
} from '@/lib/faqs/chatbot-map';

type ViewState = 'menu' | ChatbotViewKey | 'lead';
type Sender = 'bot' | 'user';

type ChatMessage = {
  id: number;
  sender: Sender;
  text: string;
  cta?: {
    label: string;
    href: string;
  };
};

type Category = {
  title: string;
  icon: ReactNode;
  intro: string;
  options: ChatOption[];
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'bot',
    text: 'Welcome to Gujarat Nippon International Pvt Ltd. I can answer quick questions, share brochure guidance, or connect you with our team.',
  },
];

const fallbackCategories: Record<ChatbotViewKey, Category> = {
  products: {
    title: 'Products & Solutions',
    icon: <Package size={18} />,
    intro: 'What would you like to know about GNIPL products and sourcing?',
    options: [
      {
        label: 'What products does GNIPL supply?',
        kind: 'answer',
        answer:
          'GNIPL supplies industrial machinery, plant equipment, mechanical systems, electrical systems, automation items, hydraulic and pneumatic components, consumables, and project-specific industrial spares. We support both standard procurement and application-led sourcing for plant requirements.',
      },
      {
        label: 'Do you provide industrial spares?',
        kind: 'answer',
        answer:
          'Yes. GNIPL helps source industrial spares for production plants, maintenance teams, shutdown requirements, and replacement needs. Share the part description, brand, drawing, rating, model number, or photos and our team can help identify the right supply route.',
      },
      {
        label: 'Do you source equipment globally?',
        kind: 'answer',
        answer:
          'Yes. GNIPL works with domestic and international supply channels to source equipment and components globally. This is useful when a plant needs OEM-equivalent items, hard-to-find parts, imports, or technically matched alternatives.',
      },
      {
        label: 'Can GNIPL handle custom requirements?',
        kind: 'answer',
        answer:
          'Yes. GNIPL can support custom requirements when specifications, drawings, operating conditions, or target applications are available. The team can review the requirement, coordinate sourcing or engineering inputs, and guide you on the next practical step.',
      },
      {
        label: 'View Products Page',
        kind: 'link',
        href: '/products',
        answer: 'Opening the products page so you can review the wider product range.',
      },
    ],
  },
  industries: {
    title: 'Industries & Services',
    icon: <Building2 size={18} />,
    intro: 'I can help with served industries, engineering scope, refurbishment, or turnkey work.',
    options: [
      {
        label: 'Which industries does GNIPL serve?',
        kind: 'answer',
        answer:
          'GNIPL serves core industrial sectors including cement, steel and metal processing, mining and material handling, energy, plastics, MDF and wood panels, chemical process plants, and infrastructure-linked manufacturing environments.',
      },
      {
        label: 'What engineering services do you provide?',
        kind: 'answer',
        answer:
          'GNIPL supports industrial sourcing, equipment selection, plant engineering coordination, electrical and mechanical systems support, commissioning assistance, maintenance-focused supply, and project procurement guidance.',
      },
      {
        label: 'Do you offer refurbishment services?',
        kind: 'answer',
        answer:
          'Yes. GNIPL can assist with refurbishment-oriented requirements such as equipment assessment, replacement spares, repair support, retrofits, reconditioning coordination, and upgrade planning depending on the machine condition and technical inputs available.',
      },
      {
        label: 'What is turnkey plant engineering?',
        kind: 'answer',
        answer:
          'Turnkey plant engineering means coordinating a complete industrial solution from requirement study and equipment planning through sourcing, integration support, installation guidance, commissioning, and handover readiness. GNIPL helps align these moving parts for plant projects.',
      },
      {
        label: 'Explore Industries & Services',
        kind: 'link',
        href: '/industries',
        answer: 'Opening the industries and services page for more detailed sector coverage.',
      },
    ],
  },
  resources: {
    title: 'Brochures & Resources',
    icon: <FileText size={18} />,
    intro: 'I can guide you to company profiles, catalogues, and downloadable resources.',
    options: [
      {
        label: 'How can I download brochures?',
        kind: 'answer',
        answer:
          'You can download available GNIPL brochures from the Resource Center. Choose the brochure you need and use the download action on the brochure card.',
        cta: { label: 'Open Brochures', href: '/brochures' },
      },
      {
        label: 'Do you have a company profile?',
        kind: 'answer',
        answer:
          'Yes. GNIPL can share a company profile that introduces our industrial supply capabilities, sector experience, sourcing support, and project assistance. The Resource Center is the best place to check available profile and brochure downloads.',
        cta: { label: 'View Resources', href: '/brochures' },
      },
      {
        label: 'Where can I find technical catalogues?',
        kind: 'answer',
        answer:
          'Technical catalogues, when available, are listed in the brochure/resource area. If you need a catalogue for a specific product, rating, brand, or application, send those details through the contact form and the team can guide you.',
      },
      {
        label: 'Open Resource Center',
        kind: 'link',
        href: '/brochures',
        answer: 'Opening the Resource Center so you can browse and download brochures.',
      },
    ],
  },
  contact: {
    title: 'Contact & Support',
    icon: <Headphones size={18} />,
    intro: 'I can answer basic support questions or connect you with a GNIPL representative.',
    options: [
      {
        label: 'What are your working hours?',
        kind: 'answer',
        answer:
          'GNIPL generally operates Monday to Saturday, 9:00 AM to 6:00 PM IST. For urgent industrial requirements, share your details and the team can respond as soon as available.',
      },
      {
        label: 'Where is GNIPL located?',
        kind: 'answer',
        answer:
          'GNIPL is based in Gujarat, India, and supports industrial customers across India and international markets. For exact office details, maps, and contact information, please use the contact page.',
        cta: { label: 'View Contact Page', href: '/contact' },
      },
      {
        label: 'How quickly can I get a response?',
        kind: 'answer',
        answer:
          'Response time depends on the technical detail required, but inquiry submissions are reviewed by the team and routed to the relevant person. Clear specifications, drawings, part numbers, or application details help speed up the reply.',
      },
      {
        label: 'Talk to a Human',
        kind: 'lead',
        answer: 'Sure. Please share a few details and a GNIPL representative will follow up with you.',
      },
    ],
  },
};

function buildCategories(faqs: ChatbotFaqPayload[]): Record<ChatbotViewKey, Category> {
  return (Object.keys(fallbackCategories) as ChatbotViewKey[]).reduce(
    (acc, view) => {
      acc[view] = {
        ...fallbackCategories[view],
        options: mergeFaqsIntoCategoryOptions(
          view,
          fallbackCategories[view].options,
          faqs
        ),
      };
      return acc;
    },
    {} as Record<ChatbotViewKey, Category>
  );
}

export default function RuleBasedChatbot() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ViewState>('menu');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messageId = useRef(initialMessages.length + 1);
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/faqs/chatbot');
        const data = await res.json();
        if (!res.ok || cancelled) return;
        const faqs = (data.faqs ?? []) as ChatbotFaqPayload[];
        if (faqs.length > 0 && !cancelled) {
          setCategories(buildCategories(faqs));
        }
      } catch {
        // Keep built-in fallback categories when API is unavailable.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, view, success, error]);

  const appendMessage = (sender: Sender, text: string, cta?: ChatMessage['cta']) => {
    setMessages((current) => [
      ...current,
      {
        id: messageId.current++,
        sender,
        text,
        cta,
      },
    ]);
  };

  const selectCategory = (nextView: ChatbotViewKey) => {
    const category = categories[nextView];
    setView(nextView);
    appendMessage('user', category.title);
    appendMessage('bot', category.intro);
  };

  const resetView = () => {
    setView('menu');
    setSuccess(false);
    setError(null);
    appendMessage('bot', 'You can choose another area below.');
  };

  const handleOption = (option: ChatOption) => {
    appendMessage('user', option.label);
    appendMessage('bot', option.answer, option.kind === 'answer' ? option.cta : undefined);

    if (option.kind === 'lead') {
      setSuccess(false);
      setError(null);
      setView('lead');
    }
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          subject: 'Chatbot human support request',
          message: formData.message,
          source: 'chatbot',
          website: formData.website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSuccess(true);
      appendMessage('bot', 'Thank you. Your request has been sent to the GNIPL team.');
      setFormData({ name: '', company: '', email: '', phone: '', message: '', website: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategory =
    view !== 'menu' && view !== 'lead' ? categories[view] : null;

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.header}>
            <div>
              <h3 className={styles.headerTitle}>GNIPL Assistant</h3>
              <p className={styles.headerSubtitle}>Website help and FAQ support</p>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div
            ref={contentRef}
            className={styles.content}
            data-lenis-prevent
          >
            <div className={styles.messageStack}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.sender === 'user' ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <p>{message.text}</p>
                  {message.cta && (
                    <Link href={message.cta.href} className={styles.inlineCta}>
                      <ArrowDownToLine size={15} />
                      {message.cta.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {view === 'menu' && (
              <div className={styles.cardGrid} aria-label="Chatbot categories">
                <button className={styles.primaryCard} onClick={() => selectCategory('products')}>
                  <span className={styles.cardIcon}>📦</span>
                  <span className={styles.cardTitle}>Products & Solutions</span>
                </button>
                <button className={styles.primaryCard} onClick={() => selectCategory('industries')}>
                  <span className={styles.cardIcon}>🏭</span>
                  <span className={styles.cardTitle}>Industries & Services</span>
                </button>
                <button className={styles.primaryCard} onClick={() => selectCategory('resources')}>
                  <span className={styles.cardIcon}>📄</span>
                  <span className={styles.cardTitle}>Brochures & Resources</span>
                </button>
                <button className={styles.primaryCard} onClick={() => selectCategory('contact')}>
                  <span className={styles.cardIcon}>📞</span>
                  <span className={styles.cardTitle}>Contact & Support</span>
                </button>
              </div>
            )}

            {activeCategory && (
              <div className={styles.optionPanel}>
                <button onClick={resetView} className={styles.backButton}>
                  <ChevronLeft size={16} /> Main Menu
                </button>
                <div className={styles.optionHeader}>
                  <span className={styles.optionIcon}>{activeCategory.icon}</span>
                  <span>{activeCategory.title}</span>
                </div>
                <div className={styles.listView}>
                  {activeCategory.options.map((option) =>
                    option.kind === 'link' ? (
                      <Link
                        key={option.label}
                        href={option.href}
                        className={`${styles.listAction} ${styles.redirectAction}`}
                        onClick={() => handleOption(option)}
                      >
                        {option.label}
                        <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <button
                        key={option.label}
                        type="button"
                        className={styles.listAction}
                        onClick={() => handleOption(option)}
                      >
                        {option.label}
                        {option.kind === 'lead' ? <Send size={16} /> : <MessageSquare size={16} />}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {view === 'lead' && (
              <div className={styles.optionPanel}>
                <button onClick={() => setView('contact')} className={styles.backButton}>
                  <ChevronLeft size={16} /> Back to Contact
                </button>

                {success ? (
                  <div className={styles.successMessage}>
                    <p>Thank you. Our team will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
                    <p className={styles.formIntro}>Please provide your details for human assistance.</p>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div>
                      <label htmlFor="lead-name">Name *</label>
                      <input
                        id="lead-name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-company">Company</label>
                      <input
                        id="lead-company"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-email">Email *</label>
                      <input
                        id="lead-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-phone">Phone</label>
                      <input
                        id="lead-phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="lead-message">Message *</label>
                      <textarea
                        id="lead-message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      style={{ display: 'none' }}
                      aria-hidden="true"
                    />
                    <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>
    </div>
  );
}
