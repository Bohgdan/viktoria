'use client';

import { useEffect, useState } from 'react';
import { Search, MessageSquare, Phone, Mail, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  type: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Нова', color: 'bg-blue-500/20 text-blue-400' },
  { value: 'in_progress', label: 'В роботі', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'closed', label: 'Завершено', color: 'bg-green-500/20 text-green-400' },
];

// Маппинг статусов из БД в UI (callback_requests используют 'contacted' вместо 'in_progress')
function normalizeStatus(status: string): string {
  if (status === 'contacted') return 'in_progress';
  return status;
}

const TYPE_LABELS: Record<string, string> = {
  callback: 'Зворотній дзвінок',
  contact: 'Контактна форма',
  calculator: 'Калькулятор',
  order: 'Замовлення',
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/requests');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Помилка завантаження заявок');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(id: string, type: string, status: string) {
    try {
      // Для callback_requests маппим in_progress -> contacted
      const dbStatus = (type === 'callback' && status === 'in_progress') ? 'contacted' : status;
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, status: dbStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');

      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast.success('Статус оновлено');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Помилка оновлення');
    }
  }

  async function handleDelete(request: Request) {
    if (!confirm(`Видалити заявку від "${request.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/requests/${request.id}?type=${request.type}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Заявку видалено');
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Помилка видалення');
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || normalizeStatus(r.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = requests.filter(r => r.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)]">
          Заявки
          {newCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-sm font-bold rounded-full">
              {newCount} нових
            </span>
          )}
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Всього {requests.length} заявок
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Пошук за ім'ям, телефоном..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="all">Всі статуси</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const displayStatus = normalizeStatus(request.status);
            const statusOption = STATUS_OPTIONS.find(s => s.value === displayStatus);
            const isExpanded = expandedId === request.id;

            return (
              <div
                key={request.id}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : request.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)]">{request.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-text-muted)]">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${request.phone}`} className="hover:text-[var(--color-accent)]" onClick={e => e.stopPropagation()}>
                            {request.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusOption?.color}`}>
                        {statusOption?.label}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)] hidden sm:block">
                        {TYPE_LABELS[request.type] || request.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-border)] p-4 space-y-4">
                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                        <span className="text-[var(--color-text-secondary)]">{formatDate(request.created_at)}</span>
                      </div>
                      {request.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <a href={`mailto:${request.email}`} className="text-[var(--color-accent)] hover:underline">
                            {request.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                        <p className="text-sm text-[var(--color-text-muted)] mb-1">Повідомлення:</p>
                        <p className="text-[var(--color-text-secondary)] whitespace-pre-line">{request.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--color-text-muted)]">Статус:</span>
                        {STATUS_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => updateStatus(request.id, request.type, opt.value)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              displayStatus === opt.value
                                ? opt.color
                                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDelete(request)}
                        className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-[var(--color-text-muted)]">
            {searchQuery || statusFilter !== 'all' ? 'Заявок не знайдено' : 'Заявок поки немає'}
          </p>
        </div>
      )}
    </div>
  );
}
