'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FolderTree, MessageSquare, Star, TrendingUp, Clock, ArrowRight, Settings } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

interface DashboardStats {
  products: number;
  categories: number;
  requests: number;
  newRequests: number;
  reviews: number;
}

interface RecentRequest {
  id: string;
  name: string;
  phone: string;
  type: string;
  created_at: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    requests: 0,
    newRequests: 0,
    reviews: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createBrowserClient();

      try {
        // Fetch stats
        const [productsRes, categoriesRes, requestsRes, newRequestsRes, reviewsRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('requests').select('id', { count: 'exact', head: true }),
          supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('reviews').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          products: productsRes.count || 0,
          categories: categoriesRes.count || 0,
          requests: requestsRes.count || 0,
          newRequests: newRequestsRes.count || 0,
          reviews: reviewsRes.count || 0,
        });

        // Fetch recent requests
        const { data: requests } = await supabase
          .from('requests')
          .select('id, name, phone, type, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentRequests(requests || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    { label: 'Товарів', value: stats.products, icon: Package, href: '/admin/products', color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Категорій', value: stats.categories, icon: FolderTree, href: '/admin/categories', color: 'bg-green-500/10 text-green-400' },
    { label: 'Заявок', value: stats.requests, icon: MessageSquare, href: '/admin/requests', color: 'bg-purple-500/10 text-purple-400', badge: stats.newRequests },
    { label: 'Відгуків', value: stats.reviews, icon: Star, href: '/admin/reviews', color: 'bg-yellow-500/10 text-yellow-400' },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      callback: 'Зворотній дзвінок',
      contact: 'Контактна форма',
      calculator: 'Калькулятор',
      order: 'Замовлення',
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400',
      processing: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
    };
    const labels: Record<string, string> = {
      new: 'Нова',
      processing: 'В роботі',
      completed: 'Завершено',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${badges[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)]">
          Дашборд
        </h1>
        <p className="text-[var(--color-text-muted)] mt-1">
          Ласкаво просимо до панелі адміністратора
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 md:p-6 hover:border-[var(--color-accent)] transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.badge !== undefined && stat.badge > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                {stat.value}
              </p>
              <p className="text-[var(--color-text-muted)] text-sm mt-1 flex items-center gap-1">
                {stat.label}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-accent)]" />
            Останні заявки
          </h2>
          <Link
            href="/admin/requests"
            className="text-sm text-[var(--color-accent)] hover:underline flex items-center gap-1"
          >
            Всі заявки
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {recentRequests.map((request) => (
              <div key={request.id} className="px-4 md:px-6 py-4 hover:bg-[var(--color-bg-hover)]">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">
                      {request.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {request.phone} • {getTypeLabel(request.type)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-[var(--color-text-muted)] hidden sm:block">
                      {formatDate(request.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-[var(--color-text-muted)]">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Заявок поки немає</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-colors"
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">Управління товарами</p>
            <p className="text-sm text-[var(--color-text-muted)]">Додавайте, редагуйте та видаляйте товари</p>
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-colors"
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-[var(--color-text-primary)]">Налаштування сайту</p>
            <p className="text-sm text-[var(--color-text-muted)]">Контакти, тексти та загальні налаштування</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
