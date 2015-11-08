class CreateReservations < ActiveRecord::Migration
  def change
    create_table :reservations do |t|
      t.string :name
      t.string :phone
      t.string :email
      t.datetime :time

      t.integer :google_sync_status, default: 0, null: false
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end
