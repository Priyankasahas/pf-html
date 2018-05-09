# frozen_string_literal: true

class EncodeString
  def self.process(string)
    URI.escape(string)
  end
end
