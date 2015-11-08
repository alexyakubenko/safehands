class Reservation < ActiveRecord::Base
  GOOGLE_SYNC_STATUSES = [
      queued: 0,
      synced: 1,
      failed: 3
  ]

  QUEUED = 0
  SERVED = 1
  MISSED = 2

  STATUSES = {
      QUEUED => 'Записан',
      SERVED => 'Обслужен',
      MISSED => 'Не приехал'
  }

  validates_uniqueness_of :time

  validates_inclusion_of :status, in: STATUSES.keys
  validates_inclusion_of :google_sync_status, in: GOOGLE_SYNC_STATUSES.keys

  after_create :send_reservation_notification

  private

  def send_reservation_notification
    
  end
end
