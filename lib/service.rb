# frozen_string_literal: true

class Service
  attr_reader :endpoint, :username, :password

  def initialize(endpoint, username, password)
    @endpoint = endpoint
    @username = username
    @password = password
  end
end
