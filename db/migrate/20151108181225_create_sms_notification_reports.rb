class CreateSmsNotificationReports < ActiveRecord::Migration
  def change
    create_table :sms_notification_reports do |t|
      t.text :params

      t.belongs_to :sms_notification

      t.timestamps
    end
  end
end
