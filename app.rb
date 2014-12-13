module Somdog
  class Donate < Sinatra::Base
    Stripe.api_key = ENV['STRIPE_API_KEY']

    set :app_file, __FILE__
    set :root, File.dirname(__FILE__)
    set :views, 'views'
    set :public_folder, 'public'
    set :scss, views: 'assets/stylesheets', cache: false

    def is_number?(i)
      true if Float(i) rescue false
    end

    get '/stylesheets/root.css' do
      content_type 'text/css', charset: 'utf-8'
      scss :root
    end

    get '/' do
      slim :'index.html', :layout => :'layouts/application.html'
    end

    get '/donate' do
      slim :'index.html', :layout => :'layouts/application.html'
    end

    get '/thanks' do
      slim :'thanks.html', :layout => :'layouts/application.html'
    end

    post '/donate' do
      if is_number?(params[:amount].to_f)
        amount = ((params[:amount].to_f) * 100).to_i

        @charge = Stripe::Charge.create(
          amount: amount,
          currency: 'usd',
          card: params[:stripeToken],
          description: "Donation")

        slim :'thanks.html', :layout => :'layouts/application.html'
      else
        redirect "/"
      end

    end

    not_found do
      slim :'404.html', :layout => :'layouts/application.html'
    end
  end
end
