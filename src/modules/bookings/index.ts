/**
 * Booking Engine — service layer
 *
 * Handles appointments, viewings, signings, and any other time-bound event.
 * Designed to integrate with calendar providers and payment processors.
 */

import { createClient } from '@/lib/supabase/server';
import type { Booking, BookingStatus, UUID } from '@/types';
import { z } from 'zod';

export const BookingInput = z.object({
  title: z.string().min(1).max(200),
  client_id: z.string().uuid().optional().nullable(),
  listing_id: z.string().uuid().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
  start_at: z.string(), // ISO datetime
  end_at: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  amount: z.number().optional().nullable(),
  currency: z.string().default('MXN'),
  notes: z.string().optional().nullable(),
  metadata: z.record(z.unknown()).default({}),
});

export type BookingInput = z.infer<typeof BookingInput>;

export const BookingService = {
  async list(orgId: UUID, opts?: { from?: string; to?: string; status?: BookingStatus }) {
    const supabase = await createClient();
    let query = supabase
      .from('bookings')
      .select('*, client:clients(id, full_name)')
      .eq('organization_id', orgId)
      .order('start_at', { ascending: true });

    if (opts?.from) query = query.gte('start_at', opts.from);
    if (opts?.to)   query = query.lte('start_at', opts.to);
    if (opts?.status) query = query.eq('status', opts.status);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(orgId: UUID, input: BookingInput) {
    const parsed = BookingInput.parse(input);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .insert({ ...parsed, organization_id: orgId, status: 'pending' })
      .select()
      .single();
    if (error) throw error;
    // TODO: trigger 'booking.created' event for automations engine
    return data as Booking;
  },

  async updateStatus(orgId: UUID, id: UUID, status: BookingStatus) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('organization_id', orgId)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Booking;
  },

  async getAvailability(orgId: UUID, userId: UUID, date: string) {
    // TODO: integrate with Google Calendar / Microsoft Calendar
    // For now, just return existing bookings for that day
    const supabase = await createClient();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('bookings')
      .select('start_at, end_at')
      .eq('organization_id', orgId)
      .eq('assigned_to', userId)
      .gte('start_at', start.toISOString())
      .lte('start_at', end.toISOString())
      .in('status', ['pending', 'confirmed', 'in_progress']);
    if (error) throw error;
    return { busy: data };
  },
};
