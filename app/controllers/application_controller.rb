# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  # from Lawrence Pit in the SC.RailsServer docs
  def auth_token
    respond_to do |wants|
      wants.js do
        if protect_against_forgery?
          render :text => "var SC = SC || {};  
            SC.RAILS_AUTH_TOKEN_NAME = '#{request_forgery_protection_token}';
            SC.RAILS_AUTH_TOKEN = '#{form_authenticity_token}';"
        end
      end
    end
  end

end
