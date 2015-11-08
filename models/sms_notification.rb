class SmsNotification < ActiveRecord::Base
  belongs_to :reservation

  has_many :sms_notification_reports

  after_create :notify!

  private

  def notify!
    twilio_credentials = YAML.load(IO.read('config/twilio.yml'))

    #plivo_credentials['auth_token'] = 'xxx'

    response = Net::HTTP.post_form(
        URI("https://#{ twilio_credentials['account_sid'] }:#{ twilio_credentials['auth_token'] }@api.twilio.com/2010-04-01/Accounts/#{ twilio_credentials['account_sid'] }/Messages.json"),
        From: '+19177914257',
        To: '+375298708995',
        Body: reservation.text_sms,
        StatusCallback: Router.sms_notification_report_url(self.id)
    )

    self.response_body = response.body

    save
  end
end
