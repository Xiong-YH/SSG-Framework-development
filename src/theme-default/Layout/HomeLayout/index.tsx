import { usePageData } from '@runtime';
import { HomeFeature } from '../components/HomeFeature/idnex';
import { HomeHero } from '../components/HomeHero';

export function HomeLayout() {
  const { frontmatter } = usePageData();

  return (
    <div>
      <HomeHero hero={frontmatter.hero} />
      <HomeFeature features={frontmatter.features} />
    </div>
  );
}
