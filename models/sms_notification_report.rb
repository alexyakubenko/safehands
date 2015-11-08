class SmsNotificationReport < ActiveRecord::Base
  belongs_to :reservation

  serialize :params, Hash
end
