class Reservation < ActiveRecord::Base
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

  after_create :send_email_notification
  after_create :send_sms_notification

  has_many :sms_notifications

  def status_text
    STATUSES[self.status]
  end

  def text_sms
    %{
    Запись #{ self.time.strftime("%D %T") }.
    #{ " #{ self.phone }" if self.phone? }
    #{ "(#{ self.name })" if self.name? }
    }.squish
  end

  private

  def send_email_notification

  end

  def send_sms_notification
    sms_notifications.create
  end
end
