# PF Prices Page

This a sample code for the purpose of demonstration. Please note, this uses older versions of Ruby and React.
The purpose of this app is to demonstrate a single page with multiple react components based on a Rails web app and interacting with a staged Rails backed API.

You can also use the following login to the production app to see all the features:
https://www.profarmergrain.com.au/
username: railstest@nzx.com
password: Priyanka2018
I have gained permissions from the Head of Melbourne operations of NZX(Owner of Profarmergrain) to be able to use the some code and production login for demonstration purposes.

## Data

No local storage, JSON content provided by prices service

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
NOTE: For the purpose of demonstrating just the prices page, we are only using Prices API service with staged responses.

The overall Profarmer Discovery architecture consists of a set of services that provide units of functionality across the wider Profarmer Discovery feature set.

- Discovery Website(HTML)

Website providing public and authenticated subscriber access to content

- Discovery Admin

Website providing Profarmer staff with access to system and content administration

- Discovery Prices

JSON API only service providing access to price content

- Discovery Subscribers

JSON API only service providing access to subscriber details and information. Maintains subscription information again data feeds from Fremantle Tech

- Discovery Data Feeds

CSV API providing access to paid data feeds.

# Running the overall system

Run bundle install within both the apps.
Please start HTMl server on localhost:3000 and Prices server on localhost:5000.
Gulp on HTMl to bundle javascript in HTML.
