class Mailer < ActionMailer::Base
  default from: 'reservation@safehands.by', to: 'alex@h-h.by,mail@safehands.by'

  def new_reservation(reservation)
    @reservation = reservation
    mail subject: "запись на шиномонтаж на #{ reservation.time.strftime('%d %b %Y %H:%M') }"
  end
end