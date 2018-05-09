# PF Prices Page

This a sample code for the purpose of demonstration. Please note, this uses some older versions of Ruby and React.

## Data

No local storage, JSON content provided by prices and subscribers services

## Platform
Please note this is based on old versions of React
- Ruby on Rails 5.0.x with Ruby 2.3.x, RSpec isolation & integration test suite
  - Dependencies specified in Gemfile
- React 0.13.x with Alt Flux & JavaScript ES6
  - Dependencies specified in package.json

## Tests

Tests written using RSpec. Style validation via Rubocop.

````
$ rspec && rubocop
````

Testing Philosophy, following recommendations in https://www.destroyallsoftware.com/screencasts/catalog/web-apps-when-to-test-in-isolation, ie:

- lib classes - isolation
- query classes - integration
- presenters - isolation
- network - isolation via VCR

### Notes

Non active record based Rails application, see lib/fetches*.rb classes for clients accessing remote data from the prices endpoints. Uses Faraday as the underlying http client.

React used to render dynamic content in templates via asset pipelines - private.

See config/webpack.config.js for Webpack configuration and package.json for configured dependencies.

Gulp is used to monitor changes to JavaScript files and regenerate the bundles. Currently these bundles are checked in but we'll revisit this shortly.

# Architecture

The following descriptions provide an overview of the overall system.

The overall Profarmer Discovery architecture consists of a set of micro-services that provide units of functionality across the wider Profarmer Discovery feature set.

- Discovery Website

Website providing public and authenticated subscriber access to content

- Discovery Admin

Website providing Profarmer staff with access to system and content administration

- Discovery Prices

JSON API only service providing access to price content

- Discovery Subscribers

JSON API only service providing access to subscriber details and information. Maintains subscription information again data feeds from Fremantle Tech

- Discovery Data Feeds

CSV API providing access to paid data feeds.

## NOTE:
For the purpose of demonstrating just the prices page, we are only using a Prices API with staged responses.

# Running the overall system

Run bundle install within both the apps.
Please start HTMl server on localhost:3000 and Prices server on localhost:5000.
Gulp is used on HTMl to bundle javascript in HTML.

## Useful links

http://clarkdave.net/2015/01/how-to-use-webpack-with-rails/
https://github.com/greenish/react-mount
https://github.com/goatslacker/alt
https://facebook.github.io/jest/
