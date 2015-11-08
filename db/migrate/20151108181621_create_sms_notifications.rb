class CreateSmsNotifications < ActiveRecord::Migration
  def change
    create_table :sms_notifications do |t|
      t.text :response_body

      t.belongs_to :reservation

      t.timestamps
    end
  end
end