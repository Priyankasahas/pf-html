# frozen_string_literal: true

def login_as(email, password)
  fill_in 'Email', with: email
  fill_in 'Password', with: password
  click_button 'Login'
end

def login(email = Settings.test.user, password = Settings.test.password)
  VCR.use_cassette('retail_providers') do
    visit login_path
  end
  VCR.use_cassette('authentication_valid_subscriber') do
    login_as(email, password)
  end
  VCR.use_cassette('authentication_valid_subscriber') do
    yield if block_given?
  end
end

def logout
  click_link 'Logout'
end

def set_subscriber_cookie_and_reset_session
  cookie_subscriber_id = cookie('subscriber_id')
  reset_session
  set_cookie(:subscriber_id, cookie_subscriber_id)
end

def session(key)
  Capybara.current_session.driver.request.session[key]
end

def reset_session
  Capybara.reset_sessions!
end

def cookie(key)
  Capybara.current_session.driver.request.cookies[key]
end

def set_cookie(key, value)
  page.driver.browser.set_cookie("#{key}=#{value}")
end
