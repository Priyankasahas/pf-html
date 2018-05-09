# frozen_string_literal: true

module ApplicationHelper
  def trading_password_reset_url(reset_id, host)
    URI.join(host, "#{Settings.clear.reset_path}/", reset_id).to_s
  end

  def safe(obj)
    obj.to_s.html_safe
  end
end
