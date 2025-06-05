import { Link } from '#i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import HeroImage from './hero-image.png';
import Emma from './emma.svg';
import Michael from './michael.svg';
import Sarah from './sarah.svg';
import GithubIcon from './github.svg';

export default async function Home() {
  const t = await getTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="fixed top-0 left-0 w-full h-[60vh] -z-10">
            <Image
              src={HeroImage}
              alt={t('hero.heroImageAlt')}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* GitHub Link */}
        <a
          href="https://github.com/garyforsterio/life-tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors"
        >
          <Image
            src={GithubIcon}
            alt={t('footer.githubAlt')}
            className="h-8 w-8 text-white"
          />
        </a>
        <div className="relative h-full flex items-center justify-center text-center px-4 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-100 mb-8">{t('hero.subtitle')}</p>
            <Link
              href="/auth/signup"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">
              {t('features.dailyDiary.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.dailyDiary.description')}
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">
              {t('features.peopleProfiles.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.peopleProfiles.description')}
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">
              {t('features.locationHistory.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.locationHistory.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('testimonials.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={Sarah}
                    alt={t('testimonials.sarah.avatarAlt')}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    {t('testimonials.sarah.name')}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {t('testimonials.sarah.title')}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic text-lg">
                {t('testimonials.sarah.quote')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={Michael}
                    alt={t('testimonials.michael.avatarAlt')}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    {t('testimonials.michael.name')}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {t('testimonials.michael.title')}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic text-lg">
                {t('testimonials.michael.quote')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={Emma}
                    alt={t('testimonials.emma.avatarAlt')}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <p className="font-semibold">{t('testimonials.emma.name')}</p>
                  <p className="text-gray-500 text-sm">
                    {t('testimonials.emma.title')}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic text-lg">
                {t('testimonials.emma.quote')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-end text-gray-500 text-sm">
          <p className="pr-4">
            {t('footer.createdBy')}{' '}
            <a
              href="https://garyforster.io"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Gary Forster
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
