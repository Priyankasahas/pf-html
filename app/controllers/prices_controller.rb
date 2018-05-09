# frozen_string_literal: true

require 'presenters/silo_snapshot_presenter'
require 'fetches_silo_pricing_contents'

class PricesController < SignedInController
  def index
    pricing_contents = FetchesSiloPricingContents.fetch(
      bhc_site_name, bulk_handler_code, grain_type
    )
    if pricing_contents.valid?
      assign_silo_attributes_and_render(pricing_contents)
    else
      flash[:error] = pricing_contents.formatted_error
    end
  end

  private

  def chilled_out?
    lower = Time.zone.parse('21:00')
    upper = Time.zone.parse('07:00')
    current = Time.zone.now
    if current.hour >= 21
      upper += 1.day
    else
      lower -= 1.day
    end

    current.between?(lower, upper)
  end

  def assign_silo_attributes_and_render(pricing_contents)
    @silo = Presenters::SiloSnapshotPresenter.new(pricing_contents)
    @is_chilled_out = chilled_out?
    render 'index'
  end

  def bhc_site_name
    params[:bhc_site_name]
  end

  def bulk_handler_code
    params[:bulk_handler_code]
  end

  def grain_type
    params[:grain_type]
  end
end
