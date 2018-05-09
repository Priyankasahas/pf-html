# frozen_string_literal: true

require 'spec_helper'
require 'fetches_port_zones'

RSpec.describe FetchesPortZones do
  context '.fetch' do
    let(:service) { double(:service, endpoint: 'http://localhost:5000', username: 'prices', password: 'password') }
    let(:model) { class_double('BhcSite').as_stubbed_const }

    before do
      allow(model).to receive(:new) { |args| OpenStruct.new(args) }
    end

    context 'results collection' do
      subject { VCR.use_cassette('port_zones') { FetchesPortZones.fetch(service) } }

      it 'should return all bhc sites of type port' do
        expect(subject.count).to eq 18
      end
    end

    context 'individual member' do
      subject do
        VCR.use_cassette('port_zones') do
          FetchesPortZones.fetch(service).first
        end
      end

      it 'should include an id' do
        expect(subject.id).to eq 737
      end

      it 'should include a name' do
        expect(subject.name).to eq 'Albany Zone'
      end

      it 'should include a port name' do
        expect(subject.port_name).to eq 'Albany'
      end

      it 'should include a bulk handler name' do
        expect(subject.bulk_handler_name).to eq 'Zone'
      end

      it 'should include a site type' do
        expect(subject.type).to eq 'PortZone'
      end

      it 'should include a pricing enabled status' do
        expect(subject.pricing_enabled).to eq true
      end
    end
  end
end
