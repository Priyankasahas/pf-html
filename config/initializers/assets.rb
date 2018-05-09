# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w( public.js private.js common-bundle.js public.css public_igrain.css public_clear.css public_agfarm.css public_grainflow.css private.css igrain.css profarmer.css grainflow.css clear.css agfarm.css )
