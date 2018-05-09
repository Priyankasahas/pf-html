# frozen_string_literal: true

require 'spec_helper'
require 'fetches_silo_snapshots/response'
require 'active_support/all'

RSpec.describe FetchesSiloSnapshots::Response do
  let(:bhc_site_name) { 'Delivered Newcastle Basin' }
  let(:port_name) { 'Newcastle' }
  let(:bulk_handler_code) { 'DEL' }
  let(:grain_type) { 'Wheat' }

  context '#formatted_grain_type' do
    subject { FetchesSiloSnapshots::Response.new(true, bhc_site_name, port_name, bulk_handler_code, grain_type) }
    let(:grain_type) { 'Faba Beans' }

    it 'should titleize the given grain type name' do
      expect(subject.grain_type_name).to eq 'Faba Beans'
    end
  end

  context '#formatted_error' do
    context 'given an encoded site name, handler code, and grain type' do
      subject { FetchesSiloSnapshots::Response.new(true, bhc_site_name, port_name, bulk_handler_code, grain_type) }

      it 'should return a formatted string of the specified attributes' do
        expect(subject.formatted_error).to eq 'No prices currently available for Delivered Newcastle Basin (DEL), Wheat'
      end
    end

    context 'given a missing site name' do
      let(:bhc_site_name) { nil }

      subject { FetchesSiloSnapshots::Response.new(true, bhc_site_name, port_name, bulk_handler_code, grain_type) }

      it 'should return a formatted string of the specified attributes' do
        expect(subject.formatted_error).to eq 'No prices currently available for the specified attributes (DEL, Wheat)'
      end
    end

    context 'given a missing handler code' do
      let(:bulk_handler_code) { nil }

      subject { FetchesSiloSnapshots::Response.new(true, bhc_site_name, port_name, bulk_handler_code, grain_type) }

      it 'should return a formatted string of the specified attributes' do
        expect(subject.formatted_error).to eq 'No prices currently available for the specified attributes (Delivered Newcastle Basin, Wheat)'
      end
    end

    context 'given a missing grain type' do
      let(:grain_type) { nil }

      subject { FetchesSiloSnapshots::Response.new(true, bhc_site_name, port_name, bulk_handler_code, grain_type) }

      it 'should return a formatted string of the specified attributes' do
        expect(subject.formatted_error).to eq 'No prices currently available for the specified attributes (Delivered Newcastle Basin, DEL)'
      end
    end
  end
end
