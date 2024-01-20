module Router
  def self.local?
    Socket.gethostname == 'Alexs-MacBook-Pro.local'
  end

  def self.base_url
    local? ? 'http://173.255.188.245:9292' : 'http://safehands.by'
  end

  def self.sms_notification_report_url(sms_notification_id)
    "#{ base_url }#{ sms_notification_report_path(sms_notification_id) }"
  end

  def self.sms_notification_report_path(sms_notification_id)
    "/sms_notification_report/#{ sms_notification_id }"
  end
end
