# frozen_string_literal: true

class Browser
  def initialize(page)
    @page = page
  end

  def put(*args, &block)
    @page.driver.put(*args, &block)
  end

  def follow!
    @page.driver.browser.follow_redirect!
  end
end
