import React, { useState } from 'react';
import { useApp } from '../../data/context';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ContactPage: React.FC = () => {
  const { client, showToast, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    await client.sendSupportMessage({
      subject: `[Contact Form] ${subject}`,
      body: `From: ${name} (${email})\n\n${body}`,
    });

    setIsSent(true);
    showToast('Support message delivered to admin inbox', 'success');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          Back to Home
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5A3C]/10 text-[#FF5A3C] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text)]">Contact Us</h1>
          <p className="text-xs text-[var(--muted)]">
            Send our operator a direct inquiry or technical support request.
          </p>
        </div>

        {isSent ? (
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-[var(--text)]">Message Dispatched!</h3>
            <p className="text-xs text-[var(--muted)]">
              Your message has been delivered to the platform administration inbox. We usually reply within 24 hours.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="outline" onClick={() => navigateTo('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karim"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karim@company.com"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                className="w-full text-xs px-3 py-2 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe your inquiry..."
                className="w-full text-xs p-3 rounded-xl bg-[var(--canvas)] border border-[var(--border)] focus:outline-none resize-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full text-xs font-bold" icon={<Send className="w-3.5 h-3.5" />}>
              Send Inquiry
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
