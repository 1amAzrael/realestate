import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../Component/ListingItem';

export default function Home() {
  const [listings, setListings] = useState({
    offer: [],
    rent: [],
    sale: []
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offers, rent, sale] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4').then(res => res.json()),
          fetch('/api/listing/get?type=rent&limit=4').then(res => res.json()),
          fetch('/api/listing/get?type=sale&limit=4').then(res => res.json())
        ]);
        
        setListings({
          offer: offers,
          rent: rent,
          sale: sale
        });
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh]  text-white">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 10000 }}
          className="h-full w-full"
        >
          {listings.offer.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${listing.imageURL[0]})` }}
              >
                <div className="flex h-full items-center bg-black bg-opacity-40 px-4 lg:px-20">
                  <div className="max-w-2xl space-y-6">
                    <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
                      Find Your Perfect {listing.type === 'rent' ? 'Rental' : 'Home'}
                    </h1>
                    <p className="text-lg lg:text-xl">
                      Discover amazing properties tailored to your needs
                    </p>
                    <Link
                      to="/search"
                      className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-blue-800 transition hover:bg-opacity-90"
                    >
                      Explore Properties
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

     

      {/* Listings Sections */}
      <main className="container mx-auto max-w-6xl px-4 py-16">
        <Section title="Featured Listings" listings={listings.offer} link="/search?offer=true" />
        <Section title="Recent Rentals" listings={listings.rent} link="/search?type=rent" />
        <Section title="Homes for Sale" listings={listings.sale} link="/search?type=sale" />
      </main>

      {/* Value Proposition */}
      <section className="bg-blue-700 text-white">
        <div className="container mx-auto max-w-6xl space-y-12 px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Why Choose Us</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Feature
              title="Verified Listings"
              content="Every property undergoes strict verification process"
              icon="✓"
            />
            <Feature
              title="Expert Support"
              content="Our team is available 24/7 to assist you"
              icon="🛎️"
            />
            <Feature
              title="Secure Process"
              content="Safe and transparent transaction process"
              icon="🔒"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, listings, link }) {
  if (!listings.length) return null;

  return (
    <div className="mb-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Link to={link} className="text-emerald-800 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function Feature({ icon, title, content }) {
  return (
    <div className="space-y-4 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-300">{content}</p>
    </div>
  );
}