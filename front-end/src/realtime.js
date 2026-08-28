import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SCHEMA, SUPABASE_TABLES } from './config'

let realtimeEnabled = false
let cleanup = () => {}

const debug = (message, ...args) => {
  if (import.meta.env.DEV) console.log('[supabase-realtime]', message, ...args)
}

export const isRealtimeEnabled = () => realtimeEnabled

/**
 * Berlangganan perubahan Postgres di tabel yang dikonfigurasi.
 * Saat ada INSERT / UPDATE / DELETE, callback `onChange` dipanggil supaya
 * peta bisa memuat ulang data secara realtime.
 *
 * @param {() => void} onChange callback yang dipanggil setiap ada perubahan tabel.
 */
export const initRealtime = (onChange) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    debug('Supabase tidak dikonfigurasi — realtime dinonaktifkan.')
    cleanup()
    return
  }

  if (realtimeEnabled) {
    debug('Realtime sudah aktif, menahan init ulang.')
    return
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  const channels = SUPABASE_TABLES.map((table) => {
    const channel = supabase
      .channel(`table-db-changes-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: SUPABASE_SCHEMA, table },
        () => {
          debug(`Perubahan terdeteksi di tabel '${table}', memuat ulang data.`)
          try {
            onChange()
          } catch (error) {
            console.error('Gagal menangani perubahan realtime:', error)
          }
        }
      )
      .subscribe((status) => {
        debug(`Channel '${table}' status subscribe:`, status)
        if (status === 'SUBSCRIBED') {
          realtimeEnabled = true
        }
      })

    return { table, channel }
  })

  cleanup = () => {
    channels.forEach(({ table, channel }) => {
      debug(`Melepas channel '${table}'.`)
      supabase.removeChannel(channel)
    })
    cleanup = () => {}
    realtimeEnabled = false
  }

  debug(`Mendaftarkan realtime untuk tabel: ${SUPABASE_TABLES.join(', ')}`)
}

export const destroyRealtime = () => cleanup()
